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
  TransactionWithTicket,
  decryptPrivateKeyNft,
  decryptPrivateKeyTicket,
} from "@/lib/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ChooseCurrencyProps = {
  handleClose: () => void;
  show: boolean;
  privateKey: string;
  action: string;
};

export default function ClaimPrize({
  handleClose,
  show,
  privateKey,
  action,
}: ChooseCurrencyProps) {
  const [copied, setCopied] = useState(false);
  const [pk, setPk] = useState("");
  console.log("🚀 ~ file: claim-prize.tsx:36 ~ pk:", pk);
  const {
    data: pkTicket,
    isLoading: ticketLoading,
    mutateAsync: triggerTicketDecrypt,
  } = useMutation({
    mutationFn: decryptPrivateKeyTicket,
    onSuccess: () => {
      console.log("success");
      if (pkTicket) {
        setPk(pkTicket?.decryptedPrivateKey);
      }
    },
  });
  console.log("🚀 ~ file: claim-prize.tsx:38 ~ pkTicket:", pkTicket);
  const {
    data: pkNft,
    isLoading: nftLoading,
    mutateAsync: triggerNftDecrypt,
  } = useMutation({
    mutationFn: decryptPrivateKeyNft,
    onSuccess: () => {
      console.log("success");
      if (pkNft) {
        setPk(pkNft?.decryptedPrivateKey);
      }
    },
  });
  console.log("🚀 ~ file: claim-prize.tsx:58 ~ pkNft:", pkNft);
  useEffect(() => {
    if (show && action == "TICKET") {
      handleTicket();
    } else if (show && action == "NFT") {
      handleNFT();
    }
  }, [action, show]);

  const handleTicket = async () => {
    await triggerTicketDecrypt(privateKey);
  };
  const handleNFT = async () => {
    await triggerNftDecrypt(privateKey);
  };

  const handleCopyButton = (pkey: string) => {
    navigator.clipboard.writeText(pkey);
    setCopied(true);
  };
  useEffect(() => {
    if (!show) {
      setCopied(false);
    }
  }, [show]);

  const pkey = pkTicket?.decryptedPrivateKey || pkNft?.decryptedPrivateKey;

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="w-[592px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Private Key</DialogTitle>
        </DialogHeader>
        <div>
          {pkey ? (
            <div className="flex flex-row gap-3">
              <input
                className="w-full px-5 py-3 text-xl font-medium border bg-brandBlack focus:outline-none border-brand rounded-xl"
                value={pkey}
                disabled
              />
              {pkey && (
                <Button
                  variant={"primary"}
                  onClick={() => handleCopyButton(pkey)}
                  className="h-full"
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
              )}
            </div>
          ) : (
            <div className="text-xl text-center">
              Decrypting wallet private key...
            </div>
          )}
          {!nftLoading && !ticketLoading && (
            <div className="pt-2 select-none">
              Use private key for your wallet and claim your nft
            </div>
          )}
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
