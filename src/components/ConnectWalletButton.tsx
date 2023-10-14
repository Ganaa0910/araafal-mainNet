import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { verifyMessage } from "@unisat/wallet-utils";
import { Buffer } from "buffer";
import crypto from "crypto";
import moment from "moment";
import Link from "next/link";
import { setAddress, setConnected } from "../slices/mainSlice";
import { User } from "@/lib/types/dbTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkTokens, loginHandler } from "@/lib/fetcherFunctions/postRequest";
import {
  clearToken,
  getAccessToken,
  getRefreshToken,
  saveToken,
} from "@/lib/auth";

function ConnectWalletButton() {
  const queryClient = useQueryClient();
  const account = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const dropdownRef = useRef();
  const [details, setDetails] = useState<User | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const checkTokenIsValid = async () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    if (accessToken) {
      const { data, status } = await checkTokens({ accessToken, refreshToken });
      console.log(
        "🚀 ~ file: _app.tsx:23 ~ checkTokenIsValid ~ status:",
        status,
      );
      if (status == 200) {
        console.log("🚀 ~ file: _app.tsx:23 ~ checkTokenIsValid ~ data:", data);
      } else if (status == 201) {
        saveToken(data);
      } else {
        handleLogout();
      }
    }
  };
  useEffect(() => {
    checkTokenIsValid();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const { data, error, isLoading, mutateAsync } = useMutation({
    mutationFn: loginHandler,
    onError: () => {
      console.log(error);
    },
    onSuccess: (data, variables) => {
      saveToken(data?.auth);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  useEffect(() => {
    const connectWalletOnLoad = async () => {
      try {
        if (window.unisat) {
          const accounts = await window.unisat.getAccounts();
          const detailsString = window.localStorage.getItem("details");
          const detailsJson =
            detailsString !== "null" ? JSON.parse(detailsString) : null;
          setDetails(detailsJson);

          if (detailsJson !== null) {
            const now = moment();
            if (now.isAfter(detailsJson.expiry)) {
              handleLogout();
              return;
            }
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

  const sign = async (message) => {
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
        window.localStorage.setItem("details", JSON.stringify(item));
        setDetails(item);
      } else {
        alert("Signature is not valid");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async () => {
    try {
      if (typeof window.unisat !== "undefined") {
        const domain = window.location.host;
        const accounts = await window.unisat.requestAccounts();
        const account = accounts[0];
        const randomBytes = crypto.randomBytes(8);
        const hexRandom = `${Buffer.from(randomBytes, "utf8").toString("hex")}`;
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
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      window.unisat.on("accountsChanged", () => {
        dispatch(setAddress(""));
        dispatch(setConnected(false));
        window.localStorage.removeItem("details");
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
    }
  });

  const handleLogout = () => {
    dispatch(setAddress(""));
    dispatch(setConnected(false));
    window.localStorage.removeItem("details");
    clearToken();
  };

  const changeNetwork = async () => {
    try {
      await window.unisat.switchNetwork("livenet");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(account.address);

    alert("Address copied to clipboard!");
  };

  async function handleProfileClick() {
    window.open(`/profile/${account.address}`, "_blank");
  }

  return (
    <div>
      {details && account.connected ? (
        <div ref={dropdownRef} className="relative inline-block text-left">
          <button
            className={
              "text-base rounded-lg bg-darkerLightGray border-lightGray hover:bg-defaultGray hover:border-lightGray"
            }
            onClick={() => setIsOpen(!isOpen)}
          >
            {details.address?.slice(0, 6) +
              "..." +
              account.address?.slice(
                account.address?.length - 4,
                account.address?.length,
              )}
          </button>
          {isOpen && (
            <div className="absolute right-0 w-40 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
              <div
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <Link href={`/profile/${account.address}/ins`}>
                  <span
                    className="block px-4 py-2 text-base border-none rounded-t-lg cursor-pointer select-none bg-darkerLightGray hover:bg-defaultGray"
                    role="menuitem"
                  >
                    Profile
                  </span>
                </Link>
                <hr className="border-defaultGray" />
                <span
                  // href="#"
                  className="block px-4 py-2 text-base rounded-b-lg cursor-pointer select-none bg-darkerLightGray hover:bg-defaultGray"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  Log out
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          className="text-base rounded-lg bg-darkerLightGray border-lightGray hover:bg-defaultGray hover:border-lightGray"
          onClick={() => handleLogin()}
        >
          Connect Unisat
        </button>
      )}
    </div>
  );
}

export default ConnectWalletButton;
