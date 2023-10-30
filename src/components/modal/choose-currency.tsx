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

const ChooseCurrency = ({ handleClose, show, tokens, setChosenCurrency }) => {
  const handle = (token) => {
    handleClose();
    setChosenCurrency(token);
  };
  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="primary-gradient w-[408px] px-8">
        <DialogHeader>
          <DialogTitle>Select a currency</DialogTitle>
        </DialogHeader>
        <div className="">
          <div className="flex flex-col w-full gap-3 text-center ">
            {tokens?.map((token) => (
              <div
                key={token?.id}
                className={`w-full bg-black/50 flex items-center gap-6 rounded-lg px-6 py-4 `}
                onClick={() => handle(token)}
              >
                <Image
                  className={`h-10 rounded-md `}
                  src={token?.imagePath}
                  alt="Card"
                  height={40}
                  width={40}
                />
                <div className="text-xl font-bold ">{token?.title}</div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChooseCurrency;
