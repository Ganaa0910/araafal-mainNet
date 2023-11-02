import axiosClient from "../axios";
import SERVER_SETTINGS from "../serverSettings";
import { User } from "../types/dbTypes";

const APIURL = SERVER_SETTINGS.BACKEND_URL;

export async function loginHandler({ walletData }: { walletData: User }) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      walletAddress: walletData,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    const response = await fetch(`${APIURL}/api/users/auth`, requestOptions);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error for handling at a higher level
  }
}

export async function whitelistLoginHandler({
  walletData,
  whitelistCode,
}: {
  walletData: User;
  whitelistCode: string | string[];
}) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      walletAddress: walletData,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    const response = await fetch(
      `${APIURL}/api/users/register/wl/${whitelistCode}`,
      requestOptions,
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error for handling at a higher level
  }
}

export async function referralLoginHandler({
  walletData,
  referralCode,
}: {
  walletData: User;
  referralCode: string | string[];
}) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      walletAddress: walletData,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    const response = await fetch(
      `${APIURL}/api/users/register/${referralCode}`,
      requestOptions,
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error for handling at a higher level
  }
}
