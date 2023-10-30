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
}) => {
  console.log(
    "🚀 ~ file: raffle-confirmation.tsx:24 ~ newRaffleData:",
    newRaffleData,
  );
  const queryClient = useQueryClient();
  const account = useSelector((state) => state.account);
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
                    {inscriptions && (
                      <div className="flex flex-col gap-4">
                        <div className="text-xl font-bold">
                          Transferable balance:
                        </div>
                        {inscriptions.map(
                          (ins) =>
                            ins.ticker == newRaffleData.sellingTokenTicker && (
                              <div className="flex flex-col gap-4">
                                <button className="text-xl font-bold">
                                  {ins.amount} {ins.ticker}
                                </button>
                              </div>
                            ),
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
            <Button
              variant={"primary"}
              onClick={handleConfirmPayment}
              className="mt-5 modal-close"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentConfirmation;
