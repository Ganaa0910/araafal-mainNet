import { Raffle, Transaction, User } from "../types/dbTypes";
import axiosClient from "../axios";
import SERVER_SETTINGS from "../serverSettings";
import axios from "axios";

const apiKey = process.env.UNISAT_API_KEY;
const apiUrl = "https://open-api.unisat.io";

const APIURL =
  process.env.NODE_ENV == "production" ? "" : "http://localhost:3001";

export interface TransactionType {
  transactionId: string;
  userId: string;
  raffleId?: string; // This is an optional field, as you mentioned
  ticketCount: string;
  transactionData: {
    transactionNonce: string;
    transactionType: string;
    token_ticker: string;
  };
}

export interface TransactionWithTicket {
  id: string;
  userId: string;
  raffleId?: string; // This is an optional field, as you mentioned
  createdAt: Date;
  Transaction: Transaction;
  raffle: Raffle;
}

export async function fetchRaffles(): Promise<Raffle[]> {
  return axiosClient.get(`/api/raffles`).then((response) => {
    return response?.data;
  });
}

export async function fetchRaffleById(id: string): Promise<Raffle> {
  return axiosClient.get(`/api/raffles/${id}`).then((response) => {
    return response?.data;
  });
}

export async function getTicketsByUser(
  id: string,
): Promise<TransactionWithTicket[]> {
  return axiosClient.get(`/api/tickets/user/${id}`).then((response) => {
    return response?.data;
  });
}

export async function getUserRaffles(id: string): Promise<Raffle[]> {
  return axiosClient.get(`/api/users/${id}/myRaffles`).then((response) => {
    return response?.data;
  });
}

export async function getTicketsByRaffle(id: string) {
  return axiosClient.get(`/api/raffles/${id}/tickets`).then((response) => {
    return response?.data;
  });
}

export async function getUserProfile(id: string): Promise<User> {
  return axiosClient.get(`/api/users/${id}`).then((response) => {
    return response?.data;
  });
}

export async function getUserWonRaffles(id: string) {
  return axiosClient.get(`/api/users/${id}/wonRaffles`).then((response) => {
    return response?.data;
  });
}

export async function getUserParticipated(id: string) {
  return axiosClient
    .get(`/api/users/${id}/participatedRaffles`)
    .then((response) => {
      return response?.data;
    });
}

export async function getInscriptions(address: string) {
  let inscriptions = [];
  try {
    const response = await axios.get(`${apiUrl}/v1/indexer/tx/${address}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    console.log(
      "🚀 ~ file: index.tsx:102 ~ getInscriptions ~ response:",
      response,
    );
    const utxo = response.data.utxo;

    for (let i = 0; i < utxo.length; i++) {
      inscriptions.push(utxo[i].inscriptions[0]);
    }

    //https://ordinals.com/preview/bbe3e8b84d9284e60337acd7c13e09c235e64ecbb087b2842118389b6f8d4c74i0 get nft content

    return inscriptions;
  } catch (error) {
    console.error(error);
  }
}
export async function getInscriptionsTestnet(address: string) {
  return axiosClient
    .get(`/api/users/${address}/inscriptions`)
    .then((response) => {
      return response?.data;
    });
}

export async function getReferralCode(address: string) {
  return axiosClient.get(`/api/users/${address}/referral`).then((response) => {
    return response?.data;
  });
}

export async function getPosition(address: string) {
  return axiosClient
    .get(`/api/users/${address}/leaderboardPosition`)
    .then((response) => {
      return response?.data;
    });
}

export async function getLeaderboard() {
  return axiosClient.get(`/api/leaderboard`).then((response) => {
    return response?.data;
  });
}

export async function createRaffle({
  newRaffleData,
}: {
  newRaffleData: Raffle;
}) {
  try {
    return axiosClient.post(`/api/raffles`, newRaffleData).then((response) => {
      return response;
    });
  } catch (error) {
    console.log("Error:", error);
  }
}

export async function createTicket({
  newTicketData,
}: {
  newTicketData: TransactionType;
}) {
  try {
    return axiosClient.post(`/api/raffles`, newTicketData).then((response) => {
      return response;
    });
  } catch (error) {
    console.log("Error:", error);
  }
}

export async function createReferral() {
  try {
    return axiosClient.post(`/api/users/referral`).then((response) => {
      return response;
    });
  } catch (error) {
    console.log("Error:", error);
  }
}
