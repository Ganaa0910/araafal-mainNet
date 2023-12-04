import { useEffect, useRef, useState } from "react";

import { verifyMessage } from "@unisat/wallet-utils";
import crypto from "crypto";
import moment from "moment";
import Link from "next/link";
// import { setAddress, setConnected } from "../slices/mainSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginHandler } from "@/lib/service/postRequest";
import { clearToken, saveToken } from "@/lib/auth";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Icons } from "./ui/icons";
import { useRouter } from "next/router";
import { getUserProfile } from "@/lib/service";
import Image from "next/image";
import { useWalletStore } from "@/slices/store";

type SavedUser = {
  address: string;
  signature: string;
  expiry: string;
};

function ConnectWalletButton() {
  const queryClient = useQueryClient();
  const { isConnected, connectedAddress, setConnectedAddress, setConnected } =
    useWalletStore();
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
    queryKey: ["userProfile", connectedAddress],
    queryFn: () => getUserProfile(connectedAddress),
    enabled: isConnected == true,
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

            setUserProfile(detailsJson.address);

            setConnectedAddress(accounts[0]);
            setConnected(true);
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
        setConnectedAddress(account);
        setConnected(true);
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
        setConnectedAddress("");
        setConnected(false);
        window.localStorage.removeItem("userProfile");
        router.push("/");
      });
    } catch (error) {
      console.log(error);
    }
  });

  const handleLogout = () => {
    setConnectedAddress("");
    setConnected(false);
    window.localStorage.removeItem("userProfile");
    router.push("/");
    clearToken();
  };

  return (
    <div>
      {userProfile && isConnected ? (
        <Link href={`/profile/${connectedAddress}`}>
          <div className="flex items-center gap-3 text-lg font-bold">
            {connectedAddress?.slice(0, 6) +
              "..." +
              connectedAddress?.slice(
                connectedAddress?.length - 4,
                connectedAddress?.length,
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
