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
import { AspectRatio } from "../ui/aspect-ratio";

type ChooseCurrencyProps = {
  handleClose: () => void;
  show: boolean;
  inscriptions: InscriptionType[] | undefined;
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
          {/* <DialogDescription>Image may seem disrupted</DialogDescription> */}
        </DialogHeader>
        <div className="w-full h-[500px] overflow-y-scroll">
          {inscriptions?.length == -0 ? (
            <div> No inscription found</div>
          ) : (
            <div className="grid w-full h-full grid-cols-4 gap-8 text-center ">
              {inscriptions?.map((ins) => (
                <div
                  key={ins.inscriptionId}
                  className={`w-full h-[300px] flex flex-col gap-3 overflow-hidden rounded-xl  ${
                    selectedCards == ins
                      ? "border-2 border-red-500 "
                      : "border-2 border-transparent"
                  }`}
                  onClick={() => setSelectedCards(ins)}
                >
                  <AspectRatio ratio={1}>
                    <Image
                      className={`w-full h-full rounded-md object-contain ${
                        selectedCards == ins ? "shadow-shadowBrand" : ""
                      }`}
                      src={`https://testnet.ordinals.com/content/${ins.inscriptionId}`}
                      alt="Card"
                      height={100}
                      width={100}
                    />
                  </AspectRatio>
                  <div className="pb-5 text-xl font-bold ">
                    {ins.inscriptionNumber}
                  </div>
                </div>
              ))}
            </div>
          )}
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
            disabled={selectedCards == null}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
