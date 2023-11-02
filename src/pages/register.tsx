import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { saveToken } from "@/lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginHandler,
  referralLoginHandler,
  whitelistLoginHandler,
} from "@/lib/service/postRequest";
import { verifyMessage } from "@unisat/wallet-utils";
import { useSelector, useDispatch } from "react-redux";
import { setAddress, setConnected } from "@/slices/mainSlice";
import moment from "moment";
import crypto from "crypto";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { ReduxAccount } from "@/lib/types";

type SavedUser = {
  address: string;
  signature: string;
  expiry: string;
};

export default function Register() {
  //https://www.araafal.com/register?referralCode=
  const router = useRouter();
  const queryClient = useQueryClient();
  const account = useSelector((state: ReduxAccount) => state.account);
  const dispatch = useDispatch();
  const { referralCode } = router.query;
  const { whitelistCode } = router.query;

  const [isConnecting, setIsConnecting] = useState(false);
  const [userProfile, setUserProfile] = useState<SavedUser | null>(null);
  console.log(
    "🚀 ~ file: register.tsx:10 ~ Register ~ whitelistCode:",
    whitelistCode,
  );
  console.log(
    "🚀 ~ file: register.tsx:9 ~ Register ~ referralCode:",
    referralCode,
  );

  const { mutateAsync } = useMutation({
    mutationFn: whitelistLoginHandler,
    onError: (error) => {
      console.log(error);
      toast.error(`Error when connecting wallet`);
    },
    onSuccess: (data, variables) => {
      saveToken(data?.auth);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setIsConnecting(false);
      toast.success(`Successfully connected`);
      router.push(`/profile/${data.walletAddress}`);
    },
  });
  const { mutateAsync: referralHandler } = useMutation({
    mutationFn: referralLoginHandler,
    onError: (error) => {
      console.log(error);
      toast.error(`Error when connecting wallet`);
    },
    onSuccess: (data, variables) => {
      saveToken(data?.auth);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setIsConnecting(false);
      toast.success(`Successfully connected`);
      router.push(`/profile/${data.walletAddress}`);
    },
  });

  const sign = async (message: string) => {
    try {
      const accounts = await window.unisat.requestAccounts();
      const account = accounts[0];
      const signature = await window.unisat.signMessage(message);
      const pubkey = await window.unisat.getPublicKey();

      const matching = verifyMessage(pubkey, message, signature);
      if (matching) {
        if (referralCode) {
          await mutateAsync({ walletData: account, referralCode });
        }
        if (whitelistCode) {
          await referralHandler({ walletData: account, whitelistCode });
        }
        dispatch(setAddress(account));
        dispatch(setConnected(true));
        const item = {
          address: account,
          signature: signature,
          expiry: moment().add(1, "days").format(),
        };
        window.localStorage.setItem("userProfile", JSON.stringify(item));
        setUserProfile(item);
      } else {
        alert("Signature is not valid");
      }
    } catch (error) {
      setIsConnecting(false);
      console.log(error);
    }
  };

  const handleLogin = async () => {
    try {
      if (typeof window.unisat !== "undefined") {
        setIsConnecting(true);
        if (!referralCode && !whitelistCode) {
          setIsConnecting(false);
          return toast.error(`URL seems wrong`);
        }
        const domain = window.location.host;
        const accounts = await window.unisat.requestAccounts();
        const account = accounts[0];
        const randomBytes = crypto.randomBytes(8);
        const hexRandom = randomBytes.toString("hex");

        const date = moment().format();
        const message = `${domain} wants you to sign in with your Bitcoin account:\n${account}\n\nI accept the Unisat Terms of Service: https://unisat.io/terms-of-service.html\n\nURI: https://${domain}\nVersion: 1\nNetwork: Livenet\nNonce: ${hexRandom}\nIssued At: ${date}Z\nExpire At: ${moment(
          date,
        )
          .add(1, "days")
          .format()}Z`;
        sign(message);
      } else {
        window.open("https://unisat.io/", "_blank");
      }
    } catch (error) {
      toast.error(`Error when connecting wallet`);
      setIsConnecting(false);
      console.log(error);
    }
  };
  return (
    <>
      <nav className="absolute top-0 left-0 w-full mx-auto">
        <div className="flex items-center justify-center flex-shrink-0 h-20 px-28">
          <div className="flex items-center h-12">
            <Link href={"/"}>
              <Image
                className="h-[40px] w-[162px]"
                src={"/araafal.svg"}
                height={48}
                width={160}
                alt="araafal"
              />
            </Link>
          </div>
        </div>
      </nav>
      <div
        className={`flex h-screen max-w-[1440px] mx-auto -mt-20 flex-col items-center justify-center`}
      >
        <div className="relative w-full h-24">
          <Image
            src={"/mesh.svg"}
            height={600}
            width={1440}
            className="absolute left-0 right-0 object-none 2xl:object-contain  w-full top-0 h-[177px] md:h-auto"
            alt="mesh"
          />
          <div className="flex items-center justify-center h-full text-3xl font-bold text-center select-none px-28 md:text-6xl">
            {referralCode ? (
              <div>
                Welcome ma early birdy bro Enjoy{" "}
                <span className="text-[#FD7C5B]">Testnet!</span>
              </div>
            ) : whitelistCode ? (
              <div>
                Welcome ma whitelist bro Enjoy{" "}
                <span className="text-[#FD7C5B]">Testnet!</span>
              </div>
            ) : (
              <div>Wrong URL</div>
            )}
          </div>
        </div>

        <div className="pt-16">
          {referralCode && (
            <Button
              variant="primary"
              onClick={() => handleLogin()}
              disabled={isConnecting}
              size={"lg"}
            >
              {isConnecting && (
                <Icons.spinner
                  className="w-4 h-4 mr-0 md:mr-2 animate-spin "
                  aria-hidden="true"
                />
              )}
              {isConnecting ? "Connecting" : "Connect Unisat"}
            </Button>
          )}
          {whitelistCode && (
            <Button
              variant="primary"
              onClick={() => handleLogin()}
              disabled={isConnecting}
              size={"lg"}
            >
              {isConnecting && (
                <Icons.spinner
                  className="w-4 h-4 mr-0 md:mr-2 animate-spin "
                  aria-hidden="true"
                />
              )}
              {isConnecting ? "Connecting" : "Connect Unisat"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
