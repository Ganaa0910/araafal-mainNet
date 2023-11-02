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
import { InscriptionType } from "@/lib/types";

type ChooseCurrencyProps = {
  handleClose: () => void;
  show: boolean;
  inscriptions: InscriptionType[];
  setChosenInscription: (inscriptions: InscriptionType | null) => void;
};

export default function ChooseInscription({
  handleClose,
  show,
  inscriptions,
  setChosenInscription,
}: ChooseCurrencyProps) {
  const [selectedCards, setSelectedCards] = useState<any>(null);

  const confirmation = () => {
    setChosenInscription(selectedCards);
    handleClose();
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="w-[1008px]">
        <DialogHeader>
          <DialogTitle>Choose inscription</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <div className="grid w-full h-full grid-cols-4 gap-8 overflow-auto text-center ">
            {inscriptions?.map((ins) => (
              <div
                key={ins.inscriptionId}
                className={`w-full flex flex-col gap-3 overflow-hidden rounded-xl  ${
                  selectedCards == ins
                    ? "border-2 border-red-500 "
                    : "border-2 border-transparent"
                }`}
                onClick={() => setSelectedCards(ins)}
              >
                <Image
                  className={`w-full rounded-md  ${
                    selectedCards == ins ? "shadow-shadowBrand" : ""
                  }`}
                  src={`https://testnet.ordinals.com/content/${ins.inscriptionId}`}
                  alt="Card"
                  height={100}
                  width={100}
                />
                <div className="pb-5 text-xl font-bold ">
                  {ins.inscriptionNumber}
                </div>
              </div>
            ))}
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
            onClick={confirmation}
            className="mt-5 modal-close"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
