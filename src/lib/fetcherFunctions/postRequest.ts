import axiosClient from "../axios";
import SERVER_SETTINGS from "../serverSettings";
import { User } from "../types/dbTypes";

const APIURL = SERVER_SETTINGS.BACKEND_URL;
export function checkTokens(data) {
  return axiosClient
    .post(`/api/users/auth/checkToken`, { ...data })
    .then((response) => {
      return response;
    });
}

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
