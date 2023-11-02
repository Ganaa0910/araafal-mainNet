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
import { TransactionWithTicket, decryptPrivateKey } from "@/lib/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ChooseCurrencyProps = {
  handleClose: () => void;
  show: boolean;
  privateKey: string;
};

export default function ClaimPrize({
  handleClose,
  show,
  privateKey,
}: ChooseCurrencyProps) {
  const [copied, setCopied] = useState(false);
  const { data: pk } = useQuery({
    queryKey: ["pk", privateKey],
    queryFn: () => {
      return decryptPrivateKey(privateKey);
    },
    enabled: show == true && privateKey !== undefined,
  });

  const handleCopyButton = (pkey: string) => {
    navigator.clipboard.writeText(pkey);
    setCopied(true);
  };
  useEffect(() => {
    if (!show) {
      setCopied(false);
    }
  }, [show]);

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="w-[592px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Private Key</DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex flex-row gap-3">
            <input
              className="w-full px-5 py-3 text-xl font-medium border bg-brandBlack focus:outline-none border-brand rounded-xl"
              value={pk?.decryptedPrivateKey}
              disabled
            />
            {pk?.decryptedPrivateKey && (
              <Button
                variant={"primary"}
                onClick={() => handleCopyButton(pk.decryptedPrivateKey)}
                className="h-full"
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </div>
          <div className="pt-2 select-none">
            Use private key for your wallet and claim your nft
          </div>
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
