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
import { TransactionWithTicket, getTicketsByUser } from "@/lib/service";

type ChooseCurrencyProps = {
  handleClose: () => void;
  show: boolean;
  tickets: TransactionWithTicket[];
  setChosenInscription: (tickets: TransactionWithTicket | null) => void;
};

export default function ClaimPrize({
  handleClose,
  show,
  claimingTicket,
}: ChooseCurrencyProps) {
  const [selectedCards, setSelectedCards] = useState<any>(null);

  const confirmation = () => {
    setChosenInscription(selectedCards);
    handleClose();
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="w-[592px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Private Key</DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex flex-row">
            <input
              className="w-full px-5 py-3 text-xl font-medium bg-brandBlack focus:outline-none border border-brand rounded-xl"
              value={claimingTicket?.nftPrivateKey}
            />
            <Button variant={"primary"}>Copy</Button>
          </div>
          <p className="select-none">
            Use private key for your wallet and claim your nft
          </p>
        </div>
        <DialogFooter className="sm:justify-start">
          <div className="flex flex-row justify-center w-full h-auto gap-2">
            <DialogClose asChild>
              <Button variant={"ghost"} className="mt-5 border border-whiteish">
                Done
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
