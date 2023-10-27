import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, RootStateOrAny } from "react-redux";

import { verifyMessage } from "@unisat/wallet-utils";
import { Buffer } from "buffer";
import crypto from "crypto";
import moment from "moment";
import Link from "next/link";
import { setAddress, setConnected } from "../slices/mainSlice";
import { User } from "@/lib/types/dbTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginHandler } from "@/lib/fetcherFunctions/postRequest";
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
type SavedUser = {
  address: string;
  signature: string;
  expiry: string;
};

function ConnectWalletButton() {
  const queryClient = useQueryClient();
  const account = useSelector((state: RootStateOrAny) => state.account);
  const dispatch = useDispatch();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<SavedUser | null>(null);

  const [isConnecting, setIsConnecting] = useState(false);

  const { data, error, isLoading, mutateAsync } = useMutation({
    mutationFn: loginHandler,
    onError: () => {
      console.log(error);
    },
    onSuccess: (data, variables) => {
      saveToken(data?.auth);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setIsConnecting(false);
      toast.success(`Successfully connected`);
    },
  });

  useEffect(() => {
    const connectWalletOnLoad = async () => {
      try {
        if (window.unisat) {
          const accounts = await window.unisat.getAccounts();
          console.log(
            "🚀 ~ file: ConnectWalletButton.tsx:62 ~ connectWalletOnLoad ~ accounts:",
            accounts,
          );
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
            console.log(
              "🚀 ~ file: ConnectWalletButton.tsx:75 ~ connectWalletOnLoad ~ detailsJson:",
              detailsJson,
            );
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
        await mutateAsync({ walletData: account });
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
        window.location.reload();
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
        <Link href={`/profile/${account.address}/ins`}>
          <Button variant="primary">
            {account.address?.slice(0, 6) +
              "..." +
              account.address?.slice(
                account.address?.length - 4,
                account.address?.length,
              )}
          </Button>
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
