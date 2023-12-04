import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createRaffle } from "@/lib/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
import PaymentConfirmation from "./payment-confirmation";
import { useWalletStore } from "@/slices/walletStore";
import { Raffle } from "@/lib/types/dbTypes";

type RaffleConfirmationProps = {
  handleClose: () => void;
  show: boolean;
  newRaffleData: Raffle;
};

const RaffleConfirmation = ({
  handleClose,
  show,
  newRaffleData,
}: RaffleConfirmationProps) => {
  const router = useRouter();
  const { connectedAddress } = useWalletStore();
  const [paymentConfModal, setPaymentConfModal] = useState(false);
  const queryClient = useQueryClient();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { data, error, isLoading, mutateAsync } = useMutation({
    mutationFn: createRaffle,
    onError: () => {
      setSubmitLoading(false);
      toast.error("We faced error when creating ticket");
      console.log(error);
    },
    onSuccess: () => {
      setSubmitLoading(false);
      toast.success("Successfully created raffle");
      queryClient.invalidateQueries({ queryKey: ["raffles"] });
      router.push(`/profile/${connectedAddress}/raf`);
    },
  });

  const handleConfirm = async () => {
    if (newRaffleData.featured == true) {
      handleClose();
      setPaymentConfModal(true);
    } else {
      try {
        setSubmitLoading(true);
        let txid = await window.unisat.sendInscription(
          newRaffleData.nftDepositAddress,
          `${newRaffleData.inscriptionId}`,
        );
        const updatedRaffleData = {
          ...newRaffleData,
          nftDepositTransactionId: txid,
        };
        await mutateAsync({ newRaffleData: updatedRaffleData });
      } catch {
        setSubmitLoading(false);
      }
    }
  };

  const triggerClose = () => {
    setPaymentConfModal(false);
  };
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

  const formatDate = (dateString: string) => {
    const options: any = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(dateString);

    return date.toLocaleString("en-US", options).replace(",", "");
  };

  return (
    <>
      <PaymentConfirmation
        show={paymentConfModal}
        handleClose={triggerClose}
        newRaffleData={newRaffleData}
        paymentToken={"PSAT"}
        paymentAmount="2000"
        paymentTokenImage="/images/psat.png"
        // triggerPaymentConfirmation={saveData}
        paymentType="RAFFLE_PAYMENT"
      />
      <Dialog open={show} onOpenChange={handleClose}>
        <DialogContent className="w-[592px] px-8">
          <DialogHeader>
            <DialogTitle>Confirm your raffle</DialogTitle>
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
                    {newRaffleData.inscriptionNumber}
                  </div>
                </div>
                <div className="flex flex-col gap-7">
                  <div className="flex flex-col gap-4">
                    <div className="text-xl font-bold">Ticket price</div>
                    <div className="flex gap-3">
                      <Image
                        src={
                          newRaffleData.sellingTokenImage
                            ? newRaffleData.sellingTokenImage
                            : "/bitcoin.svg"
                        }
                        alt="Your Image"
                        width={28}
                        height={28}
                        className="w-7 h-7"
                      />
                      <h2 className="text-xl font-bold">
                        {newRaffleData.price}{" "}
                        {newRaffleData.sellingTokenTicker
                          ? newRaffleData.sellingTokenTicker
                          : "BTC"}
                      </h2>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="text-xl font-bold">End time</div>
                    <div className="flex gap-3 text-xl">
                      <Icons.calendar className="h-7 w-7" />
                      {formatDate(newRaffleData?.endDate)}
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
              disabled={submitLoading}
            >
              {submitLoading && (
                <Icons.spinner
                  className="w-4 h-4 mr-0 md:mr-2 animate-spin "
                  aria-hidden="true"
                />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RaffleConfirmation;
