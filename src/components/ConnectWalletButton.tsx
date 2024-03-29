import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { verifyMessage } from "@unisat/wallet-utils";
import { Buffer } from "buffer";
import crypto from "crypto";
import moment from "moment";
import Link from "next/link";
import { setAddress, setConnected } from "../slices/mainSlice";
import { User } from "@/lib/types/dbTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginHandler } from "@/lib/service/postRequest";
import {
  clearToken,
  getAccessToken,
  getRefreshToken,
  saveToken,
} from "@/lib/auth";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Icons } from "./ui/icons";
import { useRouter } from "next/router";
import { ReduxAccount } from "@/lib/types";
import { getUserProfile } from "@/lib/service";
import Image from "next/image";
type SavedUser = {
  address: string;
  signature: string;
  expiry: string;
};

function ConnectWalletButton() {
  const queryClient = useQueryClient();
  const account = useSelector((state: ReduxAccount) => state.account);

  const dispatch = useDispatch();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<SavedUser | null>(null);

  const [isConnecting, setIsConnecting] = useState(false);

  const { data, error, isLoading, status, mutateAsync } = useMutation({
    mutationFn: loginHandler,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => {
      console.log(
        "🚀 ~ file: ConnectWalletButton.tsx:46 ~ ConnectWalletButton ~ data:",
        data,
      );
    },
  });

  const { data: profileData } = useQuery({
    queryKey: ["userProfile", account.address],
    queryFn: () => getUserProfile(account.address),
    enabled: account.connected == true,
  });

  useEffect(() => {
    const connectWalletOnLoad = async () => {
      try {
        if (window.unisat) {
          const accounts = await window.unisat.getAccounts();

          const detailsString = window.localStorage.getItem("userProfile");

          if (detailsString !== null) {
            const detailsJson =
              detailsString !== "null" ? JSON.parse(detailsString) : null;
            const now = moment();
            if (now.isAfter(detailsJson.expiry) || accounts.length == 0) {
              handleLogout();
              return;
            }

            setUserProfile(detailsJson);

            dispatch(setAddress(accounts[0]));
            dispatch(setConnected(true));
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    connectWalletOnLoad();
  }, []);

  const sign = async (message: string) => {
    try {
      const accounts = await window.unisat.requestAccounts();
      const account = accounts[0];
      const signature = await window.unisat.signMessage(message);
      const pubkey = await window.unisat.getPublicKey();

      const matching = verifyMessage(pubkey, message, signature);
      if (matching) {
        const data = await mutateAsync({ walletData: account });
        console.log(
          "🚀 ~ file: ConnectWalletButton.tsx:99 ~ sign ~ data:",
          data,
        );
        if (data.error) {
          setIsConnecting(false);
          return toast.error(data.error);
        } else {
          saveToken(data?.auth);

          queryClient.invalidateQueries({ queryKey: ["userProfile"] });
          setIsConnecting(false);
          toast.success(`Successfully connected`);
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
      toast.error(`Error when connecting wallet`);
      setIsConnecting(false);
      console.log(error);
    }
  };

  const handleLogin = async () => {
    try {
      if (typeof window.unisat !== "undefined") {
        setIsConnecting(true);
        const domain = window.location.host;
        const accounts = await window.unisat.requestAccounts();
        const res = await window.unisat.getNetwork();
        if (res == "livenet") {
          let res = await window.unisat.switchNetwork("testnet");
          if (res) {
            toast.success(`Wallet network changed to testnet`);
          }
        }
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

  useEffect(() => {
    try {
      window.unisat.on("accountsChanged", () => {
        dispatch(setAddress(""));
        dispatch(setConnected(false));
        window.localStorage.removeItem("userProfile");
        router.push("/");
      });
    } catch (error) {
      console.log(error);
    }
  });

  const handleLogout = () => {
    dispatch(setAddress(""));
    dispatch(setConnected(false));
    window.localStorage.removeItem("userProfile");
    router.push("/");
    clearToken();
  };

  return (
    <div>
      {userProfile && account.connected ? (
        <Link href={`/profile/${account.address}`}>
          <div className="flex items-center gap-3 text-lg font-bold">
            {account.address?.slice(0, 6) +
              "..." +
              account.address?.slice(
                account.address?.length - 4,
                account.address?.length,
              )}
            <Image
              src={
                profileData?.profileInscriptionLink
                  ? profileData.profileInscriptionLink
                  : "/images/profile.png"
              }
              height={40}
              width={40}
              className="rounded-full p-[1px] border border-white"
              alt="profile"
            />
          </div>
        </Link>
      ) : (
        <Button
          variant="primary"
          onClick={() => handleLogin()}
          disabled={isConnecting}
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
  );
}

export default ConnectWalletButton;
