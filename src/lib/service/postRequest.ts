import axiosClient from "../axios";
import SERVER_SETTINGS from "../serverSettings";
import { User } from "../types/dbTypes";
import { toast } from "sonner";

const APIURL = SERVER_SETTINGS.BACKEND_URL;

// export async function loginHandler({ walletData }: { walletData: User }) {
//   const myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/json");

//   const raw = JSON.stringify({
//     walletAddress: walletData,
//   });

//   const requestOptions = {
//     method: "POST",
//     headers: myHeaders,
//     body: raw,
//   };

//   const response = await fetch(`${APIURL}/api/users/auth`, requestOptions);

//   const result = await response.json();

//   return result;
// }

export async function loginHandler({ walletData }: { walletData: User }) {
  try {
    return axiosClient
      .post(`/api/users/auth`, JSON.stringify({ walletAddress: walletData }))
      .then((response) => {
        console.log(
          "🚀 ~ file: postRequest.ts:34 ~ .then ~ response:",
          response,
        );

        return response.data;
      });
  } catch (error) {
    console.log("Error:", error);
  }
}
export async function profileUpdateHandler({ userData }: { userData: User }) {
  try {
    return axiosClient
      .put(`/api/users/profile/edit`, JSON.stringify(userData))
      .then((response) => {
        console.log(
          "🚀 ~ file: postRequest.ts:34 ~ .then ~ response:",
          response,
        );

        return response.data;
      });
  } catch (error) {
    console.log("Error:", error);
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
    // const myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");

    // const raw = JSON.stringify({
    //   walletAddress: walletData,
    // });

    // const requestOptions = {
    //   method: "POST",
    //   headers: myHeaders,
    //   body: raw,
    // };

    // const response = await fetch(
    //   `${APIURL}/api/users/register/wl/${whitelistCode}`,
    //   requestOptions,
    // );

    // if (!response.ok) {
    //   throw new Error("Network response was not ok");
    // }

    // const result = await response.json();

    // return result;
    return axiosClient
      .post(
        `/api/users/register/wl/${whitelistCode}`,
        JSON.stringify({ walletAddress: walletData }),
      )
      .then((response) => {
        return response.data;
      });
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
    // const myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");

    // const raw = JSON.stringify({
    //   walletAddress: walletData,
    // });

    // const requestOptions = {
    //   method: "POST",
    //   headers: myHeaders,
    //   body: raw,
    // };

    // const response = await fetch(
    //   `${APIURL}/api/users/register/${referralCode}`,
    //   requestOptions,
    // );

    // if (!response.ok) {
    //   throw new Error("Network response was not ok");
    // }

    // const result = await response.json();

    // return result;

    return axiosClient
      .post(
        `/api/users/register/${referralCode}`,
        JSON.stringify({ walletAddress: walletData }),
      )
      .then((response) => {
        return response.data;
      });
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error for handling at a higher level
  }
}
