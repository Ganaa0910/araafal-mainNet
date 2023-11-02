import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";
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
import { useMutation } from "@tanstack/react-query";
import { createRaffle } from "@/lib/service";
import { useQueryClient } from "@tanstack/react-query";
import { Icons } from "../ui/icons";
import PaymentConfirmation from "./payment-confirmation";
import { Raffle } from "@/lib/types/dbTypes";
import { ReduxTicketObject } from "@/lib/types";
import { useSelector } from "react-redux";

type ChooseCurrencyProps = {
  handleClose: () => void;
  show: boolean;
  newRaffleData: Raffle;
};

export default function TicketConfirmation({
  handleClose,
  show,
  newRaffleData,
}: ChooseCurrencyProps) {
  const ticket = useSelector((state: ReduxTicketObject) => state.ticket);
  const [paymentConfModal, setPaymentConfModal] = useState(false);
  const queryClient = useQueryClient();
  const [inscribeModal, setInscribeModal] = useState(false);
  const { data, error, isLoading, mutateAsync } = useMutation({
    mutationFn: createRaffle,
    onError: () => {
      console.log(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raffles"] });
    },
  });

  const handleConfirm = async () => {
    handleClose();
    setPaymentConfModal(true);
    // if (newRaffleData.featured == true) {
    //   console.log(
    //     "🚀 ~ file: ticket-confirmation.tsx:47 ~ handleConfirm ~ newRaffleData:",
    //     newRaffleData,
    //   );
    //   handleClose();
    //   setPaymentConfModal(true);
    // } else {
    //   console.log(
    //     "🚀 ~ file: ticket-confirmation.tsx:56 ~ handleConfirm ~ newRaffleData.nftDepositAddress:",
    //     newRaffleData.nftDepositAddress,
    //   );
    //   console.log(
    //     "🚀 ~ file: ticket-confirmation.tsx:62 ~ handleConfirm ~ newRaffleData.inscriptionId:",
    //     newRaffleData.inscriptionId,
    //   );

    //   let txid = await window.unisat.sendInscription(
    //     newRaffleData.nftDepositAddress,
    //     `${newRaffleData.inscriptionId}`,
    //   );
    //   const updatedRaffleData = {
    //     ...newRaffleData,
    //     nftDepositTransactionId: txid,
    //   };
    //   await mutateAsync({ newRaffleData: updatedRaffleData });
    // }
  };

  const saveData = async () => {
    await mutateAsync({ newRaffleData });
  };
  const triggerClose = () => {
    setPaymentConfModal(false);
  };
  // const formattedDate = newRaffleData?.endDate?.toLocaleString(    "en-US", {
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
  const tokens = [
    { id: 1, title: "BTC", imagePath: "/bitcoin.svg" },
    { id: 2, title: "ORDI", imagePath: "/images/ordi.png" },
    { id: 3, title: "PSAT", imagePath: "/images/psat.png" },
    { id: 4, title: "SATS", imagePath: "/images/sats.png" },
    { id: 5, title: "TRAC", imagePath: "/images/trac.png" },
    { id: 6, title: "JOEM", imagePath: "/images/trac.png" },
  ];
  const selectedToken = tokens.find(
    (token) => token.title === newRaffleData?.sellingTokenTicker,
  );

  return (
    <>
      <PaymentConfirmation
        show={paymentConfModal}
        handleClose={triggerClose}
        newRaffleData={newRaffleData}
        paymentToken={newRaffleData?.sellingTokenTicker}
        paymentAmount={String(newRaffleData?.price * ticket?.amount)}
        paymentTokenImage={
          selectedToken ? selectedToken.imagePath : "/bitcoin.svg"
        }
        // triggerPaymentConfirmation={saveData}
        paymentType="TICKET_PAYMENT"
      />
      <Dialog open={show} onOpenChange={handleClose}>
        <DialogContent className="w-[592px] px-8">
          <DialogHeader>
            <DialogTitle>Transfer</DialogTitle>
          </DialogHeader>
          <div className="w-full">
            <div className="flex flex-col">
              <div className="flex gap-6">
                <div
                  className={`w-[202px] flex flex-col gap-3 overflow-hidden text-center rounded-xl
                `}
                >
                  <Image
                    className={`w-full rounded-md`}
                    src={newRaffleData?.inscriptionPreviewUrl}
                    alt="Card"
                    height={100}
                    width={100}
                  />
                  <div className="pb-5 text-xl font-bold ">
                    {newRaffleData?.name}
                  </div>
                </div>
                <div className="flex flex-col gap-7">
                  <div className="flex flex-col gap-4">
                    <div className="text-xl font-bold">Ticket price</div>
                    <div className="flex gap-3">
                      <Image
                        src={
                          selectedToken
                            ? selectedToken.imagePath
                            : "/bitcoin.svg"
                        }
                        alt="Your Image"
                        width={28}
                        height={28}
                        className="w-7 h-7"
                      />
                      <h2 className="text-xl font-bold">
                        {newRaffleData?.price}{" "}
                        {newRaffleData?.sellingTokenTicker
                          ? newRaffleData?.sellingTokenTicker
                          : "BTC"}
                      </h2>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="text-xl font-bold">Ticket count</div>
                    <div className="flex gap-3">
                      <h2 className="text-xl font-bold">
                        {ticket?.amount} tickets
                      </h2>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="text-xl font-bold">Sum amount</div>
                    <div className="flex gap-3">
                      <div className="flex gap-3">
                        <Image
                          src={
                            selectedToken
                              ? selectedToken.imagePath
                              : "/bitcoin.svg"
                          }
                          alt="Your Image"
                          width={28}
                          height={28}
                          className="w-7 h-7"
                        />
                        <h2 className="text-xl font-bold">
                          {newRaffleData?.price * ticket?.amount}{" "}
                          {newRaffleData?.sellingTokenTicker
                            ? newRaffleData?.sellingTokenTicker
                            : "BTC"}
                        </h2>
                      </div>
                    </div>
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
            <Button
              variant={"primary"}
              onClick={handleConfirm}
              className="mt-5 modal-close"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
