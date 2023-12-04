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
import {
  createTicket,
  getUserBRC20Balance,
  getUserBitcoinBalance,
} from "@/lib/service";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createRaffle } from "@/lib/service";
import { useQueryClient } from "@tanstack/react-query";
import { Icons } from "../ui/icons";
import { useSelector } from "react-redux";
import { Raffle, TransactionType } from "@/lib/types/dbTypes";
import { toast } from "sonner";
import { ReduxAccount, ReduxTicketObject, UserBrc20Type } from "@/lib/types";
import { useRouter } from "next/router";
import { useWalletState } from "@/slices/store";
type ChooseCurrencyProps = {
  handleClose: () => void;
  show: boolean;
  newRaffleData: Raffle;
  paymentToken: string;
  paymentAmount: string;
  paymentTokenImage: string;
  paymentType: string;
};

export default function PaymentConfirmation({
  handleClose,
  show,
  newRaffleData,
  paymentToken,
  paymentAmount,
  paymentTokenImage,
  paymentType,
}: ChooseCurrencyProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  // const account = useSelector((state: ReduxAccount) => state.account);
  const { isConnected, connectedAddress, setConnectedAddress, setConnected } =
    useWalletState();
  const ticket = useSelector((state: ReduxTicketObject) => state.ticket);
  const [filteredIns, setFilteredIns] = useState<UserBrc20Type[]>([]);

  const [selectBrc20, setSelectedBrc20] = useState<UserBrc20Type | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { mutateAsync: triggerTicket } = useMutation({
    mutationFn: createTicket,
    onError: () => {
      toast.error("We faced error when creating ticket");
      setSubmitLoading(false);
      // console.log(error);
    },
    onSuccess: () => {
      setSubmitLoading(false);
      toast.success("Successfully bought ticket");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      handleClose();
    },
  });
  const { data, error, isLoading, mutateAsync } = useMutation({
    mutationFn: createRaffle,
    onError: () => {
      toast.error("We faced error when creating raffle");
      setSubmitLoading(false);
      // console.log(error);
    },
    onSuccess: async () => {
      toast.success("Successfully created raffle");
      setSubmitLoading(false);
      queryClient.invalidateQueries({ queryKey: ["raffles"] });
      router.push(`/profile/${connectedAddress}/raf`);
    },
  });

  const { data: userbrc20s, isLoading: brc20Loading } = useQuery({
    queryKey: ["userbrc20", connectedAddress],
    queryFn: () => {
      return getUserBRC20Balance(connectedAddress);
    },
    enabled: isConnected == true && show == true,
  });
  const { data: bitcoinBalance } = useQuery({
    queryKey: ["userbitcoin", connectedAddress],
    queryFn: () => {
      return getUserBitcoinBalance(connectedAddress);
    },
    enabled: isConnected == true,
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["userbrc20", connectedAddress],
    });
  }, [show]);

  useEffect(() => {
    if (userbrc20s && userbrc20s?.length !== 0) {
      const filteredArray = userbrc20s.filter(
        (item) => item.ticker === paymentToken && item.amount == paymentAmount,
      );
      setFilteredIns(filteredArray);
      setSelectedBrc20(filteredArray[0]);
    }
  }, [userbrc20s]);

  async function handleInscribeButtonClick() {
    try {
      setSubmitLoading(true);
      const tx = await window.unisat.inscribeTransfer(
        paymentToken,
        paymentAmount,
      );
      setSubmitLoading(false);
      toast.success(
        "Successfully inscribed. Now wait until block is confirmed",
      );
      // setInscriptionId(tx.inscriptionId);
    } catch (error) {
      toast.error("We faced error when inscribing");
      setSubmitLoading(false);
      console.log(error);
    }
  }
  async function sendInscriptionAndName(
    walletAddress: string,
    inscriptionId: string,
  ) {
    let txid = await window.unisat.sendInscription(
      walletAddress,
      inscriptionId,
    );
    console.log("🚀 ~ file: payment-confirmation.tsx:117 ~ txid:", txid);
    return txid;
  }

  const waitOneSecond = (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  // async function transferInscription(inscriptionId: string) {
  //   console.log(account);

  // }

  async function transferInscription() {
    setSubmitLoading(true);
    if (selectBrc20 == null && paymentToken !== "BTC") {
      toast.error("Select brc 20 first");
      return setSubmitLoading(false);
    }
    if (paymentType == "RAFFLE_PAYMENT") {
      try {
        const psattx = await sendInscriptionAndName(
          "tb1pk4dzxehzkcmqk3c685gukuhjamvcs690tdlemrcrvttjy273gqmsrh2us5",
          selectBrc20?.inscriptionId as string,
        );

        await waitOneSecond();

        let txid = await window.unisat.sendInscription(
          newRaffleData.nftDepositAddress,
          `${newRaffleData.inscriptionId}`,
        );

        const updatedRaffleData = {
          ...newRaffleData,
          featuredTransanctionId: psattx,
          nftDepositTransactionId: txid,
        };
        if (psattx && txid) {
          await mutateAsync({ newRaffleData: updatedRaffleData });
        }
      } catch (error) {
        toast.error("We faced error when creating raffle payment");
        setSubmitLoading(false);
        console.log(error);
      }
    } else if (paymentType == "TICKET_PAYMENT") {
      try {
        let txid;
        if (paymentToken === "BTC") {
          txid = await window.unisat.sendBitcoin(
            newRaffleData.ticketDepositAddress,
            parseInt(
              (ticket?.amount * newRaffleData?.price * 100000000).toString(),
            ),
          );
        } else {
          txid = await window.unisat.sendInscription(
            newRaffleData.ticketDepositAddress,
            selectBrc20?.inscriptionId,
          );
        }

        if (txid && newRaffleData.id) {
          const variables = {
            transactionId: txid,
            ticketCount: ticket.amount,
            raffleId: newRaffleData.id,
            userId: connectedAddress,
            transactionData: {
              transactionNonce: "1",
              transactionType: "TICKET_TRANSACTION",
              token_ticker: paymentToken,
            },
          };
          await triggerTicket({ newTicketData: variables });
        } else {
          toast.error("We faced error when creating ticket payment");
          setSubmitLoading(false);
        }
        // console.log(txid);
      } catch (error) {
        toast.error("We faced error when creating ticket payment");
        setSubmitLoading(false);
        console.log(error);
      }
    }
  }

  return (
    <>
      <Dialog open={show} onOpenChange={handleClose}>
        <DialogContent className="w-[592px] px-8">
          <DialogHeader>
            <DialogTitle>Transfer</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between w-full">
                <div className="text-xl font-bold">Payment info:</div>
                <div className="flex gap-3">
                  <Image
                    src={paymentTokenImage ? paymentTokenImage : "/bitcoin.svg"}
                    alt="Your Image"
                    width={28}
                    height={28}
                    className="w-7 h-7"
                  />
                  <h2 className="text-xl font-bold">
                    {paymentAmount} {paymentToken ? paymentToken : "BTC"}
                  </h2>
                </div>
              </div>
              {userbrc20s && (
                <div className="flex flex-col gap-4">
                  <div className="text-xl font-bold">Transferable balance:</div>
                  <div className="grid grid-cols-2 gap-6">
                    {filteredIns &&
                      filteredIns.map((ins) => (
                        <div
                          className="flex w-full gap-3"
                          key={ins.inscriptionId}
                        >
                          <button
                            className={`flex gap-3 border w-full py-3 px-5 rounded-lg text-xl font-bold ${
                              selectBrc20 == ins
                                ? " border-brand"
                                : "border-white"
                            }`}
                            onClick={() => setSelectedBrc20(ins)}
                          >
                            <Image
                              src={
                                paymentTokenImage
                                  ? paymentTokenImage
                                  : "/bitcoin.svg"
                              }
                              alt="Your Image"
                              width={28}
                              height={28}
                              className="w-7 h-7"
                            />
                            {ins.amount} {ins.ticker}
                          </button>
                        </div>
                      ))}
                    {paymentToken == "BTC" && (
                      <div className="flex gap-3 text-xl font-bold">
                        <Image
                          src={
                            paymentTokenImage
                              ? paymentTokenImage
                              : "/bitcoin.svg"
                          }
                          alt="Your Image"
                          width={28}
                          height={28}
                          className="w-7 h-7"
                        />{" "}
                        {bitcoinBalance / 100000000}
                      </div>
                    )}
                  </div>
                  {paymentToken != "BTC" && filteredIns.length == 0 && (
                    <div className="text-center">
                      You don&apos;t have inscription. Inscribe now
                    </div>
                  )}
                </div>
              )}
              {paymentToken != "BTC" && brc20Loading && (
                <div className="text-center">Loading please wait</div>
              )}
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
            {paymentToken != "BTC" && filteredIns.length == 0 ? (
              <Button
                variant={"primary"}
                onClick={handleInscribeButtonClick}
                className="mt-5 modal-close"
                disabled={submitLoading}
              >
                {submitLoading && (
                  <Icons.spinner
                    className="w-4 h-4 mr-0 md:mr-2 animate-spin "
                    aria-hidden="true"
                  />
                )}
                Incribe
              </Button>
            ) : (
              <Button
                variant={"primary"}
                onClick={transferInscription}
                className="mt-5 modal-close"
                disabled={submitLoading}
              >
                {submitLoading && (
                  <Icons.spinner
                    className="w-4 h-4 mr-0 md:mr-2 animate-spin "
                    aria-hidden="true"
                  />
                )}
                Transfer
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
