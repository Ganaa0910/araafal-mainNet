import Image from "next/image";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUserBRC20Balance } from "@/lib/service";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createRaffle } from "@/lib/service";
import { useQueryClient } from "@tanstack/react-query";
import { Icons } from "../ui/icons";
import { useSelector } from "react-redux";

const PaymentConfirmation = ({
  handleClose,
  show,
  newRaffleData,
  triggerPaymentConfirmation,
  paymentToken,
  paymentAmount,
  paymentTokenImage,
}) => {
  console.log(
    "🚀 ~ file: raffle-confirmation.tsx:24 ~ newRaffleData:",
    newRaffleData,
  );
  const queryClient = useQueryClient();
  const account = useSelector((state) => state.account);
  const [inscribeModal, setInscribeModal] = useState(false);
  const [filteredIns, setFilteredIns] = useState([]);
  const { data, error, isLoading, mutateAsync } = useMutation({
    mutationFn: createRaffle,
    onError: () => {
      console.log(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raffles"] });
    },
  });

  const handleConfirmPayment = () => {
    triggerPaymentConfirmation;
  };

  const { data: inscriptions } = useQuery({
    queryKey: ["userbrc20", account],
    queryFn: () => {
      return getUserBRC20Balance(account.address);
    },
    enabled: account.connected == true,
  });

  console.log(inscriptions);
  useEffect(() => {
    if (inscriptions) {
      const filteredArray = inscriptions.filter(
        (item) => item.ticker === paymentToken && item.amount == paymentAmount,
      );
      setFilteredIns(filteredArray);
    }
  }, [inscriptions]);

  async function handleInscribeButtonClick() {
    try {
      const tx = await window.unisat.inscribeTransfer(
        paymentToken,
        paymentAmount,
      );
      // setInscriptionId(tx.inscriptionId);
    } catch (error) {
      console.log(error);
    }
  }

  //  async function transferInscription(inscriptionId: string) {
  //   console.log(account);
  //   try {
  //     let txid = await window.unisat.sendInscription(
  //       raffleDetail.ticketDepositAddress,
  //       inscriptionId,
  //     );
  //     console.log(
  //       "🚀 ~ file: PurchaseOverlay.tsx:160 ~ transferInscription ~ txid:",
  //       txid,
  //     );
  //     if (txid) {
  //       const variables: TransactionType = {
  //         transactionId: txid,
  //         ticketCount: ticket.amount,
  //         raffleId: raffleDetail.id,
  //         userId: account.address,
  //         transactionData: {
  //           transactionNonce: "1",
  //           transactionType: "TICKET_TRANSACTION",
  //           token_ticker: selectedToken,
  //         },
  //       };
  //       await mutateAsync({ newTicketData: variables });
  //     }
  //     // console.log(txid);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // const formattedDate = newRaffleData?.endDate?.toLocaleString("en-US", {
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  //   hour: "numeric",
  //   minute: "numeric",
  //   second: "numeric",
  //   timeZoneName: "short",
  // });

  // const renderHumanReadableDate = (dateString: string) => {
  //   console.log(
  //     "🚀 ~ file: raffle-confirmation.tsx:53 ~ renderHumanReadableDate ~ dateString:",
  //     dateString,
  //   );
  //   const date = new Date(dateString);

  //   return date.toLocaleDateString("en-GB");
  // };

  return (
    <>
      <Dialog open={show} onOpenChange={handleClose}>
        <DialogContent className="w-[592px] px-8">
          <DialogHeader>
            <DialogTitle>Transfer</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <div className="flex flex-col">
              <div className="flex gap-6">
                <div className="flex flex-col gap-7">
                  <div className="flex flex-col gap-4">
                    <div className="text-xl font-bold">Payment info</div>
                    <div className="flex gap-3">
                      <Image
                        src={
                          paymentTokenImage ? paymentTokenImage : "/bitcoin.svg"
                        }
                        alt="Your Image"
                        width={28}
                        height={28}
                        className="w-7 h-7"
                      />
                      <h2 className="text-xl font-bold">
                        {paymentAmount} {paymentToken ? paymentToken : "BTC"}
                      </h2>
                    </div>
                    {inscriptions && (
                      <div className="flex flex-col gap-4">
                        <div className="text-xl font-bold">
                          Transferable balance:
                        </div>
                        {filteredIns ? (
                          filteredIns.map((ins) => (
                            <div className="flex flex-col gap-4" key={ins.id}>
                              <button className="text-xl font-bold">
                                {ins.amount} {ins.ticker}
                              </button>
                            </div>
                          ))
                        ) : (
                          <div>You dont have inscription. Inscribe now</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <div className="flex flex-row justify-end w-full h-auto gap-2">
              <DialogClose asChild>
                <Button variant={"ghost"} className="mt-5">
                  Cancel
                </Button>
              </DialogClose>
            </div>
            {filteredIns.length == 0 ? (
              <Button
                variant={"primary"}
                onClick={handleInscribeButtonClick}
                className="mt-5 modal-close"
              >
                Incribe
              </Button>
            ) : (
              <Button
                variant={"primary"}
                onClick={handleConfirmPayment}
                className="mt-5 modal-close"
              >
                Confirm
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentConfirmation;
