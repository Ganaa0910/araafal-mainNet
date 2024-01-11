import { Raffle, Transaction, User } from "../types/dbTypes";
import axiosClient from "../axios";
import SERVER_SETTINGS from "../serverSettings";
import axios from "axios";
import {
  InscriptionType,
  LeaderboardEachUserType,
  UserBrc20Type,
} from "../types";

const apiKey = process.env.UNISAT_API_KEY;
const apiUrl = "https://open-api.unisat.io";

const APIURL =
  process.env.NODE_ENV == "production" ? "" : "http://localhost:3001";

export interface TransactionType {
  transactionId: string;
  userId: string;
  raffleId: string; // This is an optional field, as you mentioned
  ticketCount: number;
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
  endDateUnix: string;
  inscriptionPreviewUrl: string;
  name: string;
  ticketCount: string;
  winnerId: string;
  nftPrivateKey: string;
  createdAt: Date;
  Transaction: Transaction;
  raffle: Raffle;
}

export async function fetchRaffles({
  pageParam = 1,
  limitParam = 10,
}): Promise<{ raffles: Raffle[]; nextPage: number; nextLimit: number }> {
  const response = await axiosClient.get(
    `/api/mainNet/raffles?page=${pageParam}&limit=${limitParam}`,
  );
  const raffles = response?.data.data;
  const nextPage = pageParam + 1;
  const nextLimit = limitParam;
  return { raffles, nextPage, nextLimit };
}

export async function fetchFeaturedRaffles(): Promise<Raffle[]> {
  return axiosClient.get(`/api/mainNet/raffles/featured`).then((response) => {
    return response?.data.data;
  });
}

export async function fetchRaffleById(id: string): Promise<Raffle> {
  return axiosClient.get(`/api/mainNet/raffles/${id}`).then((response) => {
    return response?.data.data;
  });
}

export async function getTicketsByUser(
  id: string,
): Promise<{ rows: TransactionWithTicket[] }> {
  return axiosClient.get(`/api/mainNet/tickets/user/${id}`).then((response) => {
    return response?.data.data;
  });
}

export async function getUserRaffles(id: string): Promise<Raffle[]> {
  return axiosClient.get(`/api/mainNet/users/${id}/myRaffles`).then((response) => {
    return response?.data.data;
  });
}

export async function getTicketsByRaffle(id: string) {
  return axiosClient.get(`/api/mainNet/raffles/${id}/tickets`).then((response) => {
    return response?.data.data;
  });
}
export async function getTicketsCountByRaffle(id: string) {
  return axiosClient
    .get(`/api/mainNet/raffles/${id}/tickets/count`)
    .then((response) => {
      return response?.data.data;
    });
}

export async function getUserProfile(address: string): Promise<User> {
  return axiosClient.get(`/api/mainNet/users/${address}/profile`).then((response) => {
    return response?.data.data;
  });
}

export async function getUserWonRaffles(id: string) {
  return axiosClient.get(`/api/mainNet/users/${id}/wonRaffles`).then((response) => {
    return response?.data.data;
  });
}

export async function getUserParticipated(id: string) {
  return axiosClient
    .get(`/api/mainNet/users/${id}/participatedRaffles`)
    .then((response) => {
      return response?.data.data;
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
export async function getInscriptionsTestnet(
  address: string,
): Promise<InscriptionType[]> {
  return axiosClient
    .get(`/api/mainNet/users/${address}/inscriptions`)
    .then((response) => {
      return response?.data.data;
    });
}
export async function decryptPrivateKeyNft(
  privateKey: string,
): Promise<{ decryptedPrivateKey: string }> {
  return axiosClient
    .post(`/api/mainNet/raffles/decryptPrivateKey/${privateKey}/nft`)
    .then((response) => {
      return response?.data.data;
    });
}
export async function decryptPrivateKeyTicket(
  privateKey: string,
): Promise<{ decryptedPrivateKey: string }> {
  return axiosClient
    .post(`/api/mainNet/raffles/decryptPrivateKey/${privateKey}/ticket`)
    .then((response) => {
      return response?.data.data;
    });
}
export async function getUserBRC20Balance(
  address: string,
): Promise<UserBrc20Type[]> {
  return axiosClient.get(`/api/mainNet/users/${address}/brc20`).then((response) => {
    return response?.data.data;
  });
}
export async function getUserBitcoinBalance(address: string) {
  return axiosClient.get(`/api/mainNet/users/${address}/bitcoin`).then((response) => {
    return response?.data.data;
  });
}
export async function getReferralCode(address: string) {
  return axiosClient.get(`/api/mainNet/users/${address}/referral`).then((response) => {
    return response?.data.data;
  });
}

export async function getPosition(address: string) {
  return axiosClient
    .get(`/api/mainNet/users/${address}/leaderboardPosition`)
    .then((response) => {
      return response?.data.data;
    });
}

export async function getLeaderboard(): Promise<LeaderboardEachUserType[]> {
  return axiosClient.get(`/api/mainNet/leaderboard`).then((response) => {
    return response?.data.data;
  });
}

export async function createRaffle({
  newRaffleData,
}: {
  newRaffleData: Raffle;
}) {
  try {
    return axiosClient.post(`/api/mainNet/raffles`, newRaffleData).then((response) => {
      return response;
    });
  } catch (error) {
    console.log("Error:", error);
  }
}

export async function updateRaffle({
  newRaffleData,
}: {
  newRaffleData: Raffle;
}) {
  try {
    return axiosClient
      .put(`/api/mainNet/raffles/${newRaffleData.id}`, newRaffleData)
      .then((response) => {
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
    return axiosClient.post(`/api/mainNet/tickets`, newTicketData).then((response) => {
      return response;
    });
  } catch (error) {
    console.log("Error:", error);
  }
}

export async function createReferral() {
  try {
    return axiosClient.post(`/api/mainNet/users/referral`).then((response) => {
      return response;
    });
  } catch (error) {
    console.log("Error:", error);
  }
}

export async function createWalletForRaffle() {
  try {
    return axiosClient.post(`/api/mainNet/raffles/generateWallet`).then((response) => {
      return response;
    });
  } catch (error) {
    console.log("Error:", error);
  }
}
