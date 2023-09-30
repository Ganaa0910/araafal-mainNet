import { Raffle, Transaction, User } from "../types/dbTypes";
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
  const response = await fetch(`${APIURL}/api/raffles`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function fetchRaffleById(id: string): Promise<Raffle> {
  const response = await fetch(`${APIURL}/api/raffles/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getTicketsByUser(
  id: string,
): Promise<TransactionWithTicket[]> {
  const response = await fetch(`${APIURL}/api/tickets/user/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getUserRaffles(id: string): Promise<Raffle[]> {
  const response = await fetch(`${APIURL}/api/users/${id}/myRaffles`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getTicketsByRaffle(id: string) {
  const response = await fetch(`${APIURL}/api/tickets/raffle/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getUserProfile(id: string) {
  const response = await fetch(`${APIURL}/api/users/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getUserWonRaffles(id: string) {
  const response = await fetch(`${APIURL}/api/users/${id}/wonRaffles`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getUserParticipated(id: string) {
  const response = await fetch(`${APIURL}/api/users/${id}/participatedRaffles`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
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

export async function createRaffle({
  newRaffleData,
}: {
  newRaffleData: Raffle;
}) {
  try {
    const { data, status } = await makePostRequest<Raffle>(
      `${APIURL}/api/raffles`,
      newRaffleData,
    );

    if (!data || status !== 200) {
      throw new Error("Network response was not OK");
    }

    return { data, status };
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error for handling at a higher level
  }
}

export async function createTicket({
  newTicketData,
}: {
  newTicketData: TransactionType;
}) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify(newTicketData);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    const response = await fetch(`${APIURL}/api/tickets`, requestOptions);

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
export async function loginHandler({
  walletData,
}: {
  walletData: User;
}): Promise<User> {
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

    // Assuming result contains the user data
    const user: User = result; // You may need to adjust this based on the actual structure of 'result'

    return user;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error for handling at a higher level
  }
}

async function makePostRequest<T>(
  url: string,
  data: T,
): Promise<{ data: T; status: number }> {
  try {
    // Create a new request object
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Adjust content type as needed
      },
      body: JSON.stringify(data), // Convert data to JSON string
    };

    // Send the POST request and wait for the response
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Parse the response body as JSON and return the parsed data
    const responseData = await response.json();
    const status = response.status;
    return { data: responseData, status };
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error for handling at a higher level
  }
}

async function makePutRequest<T>(
  url: string,
  data: T,
): Promise<{ data: T; status: number }> {
  try {
    // Create a new request object
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Adjust content type as needed
      },
      body: JSON.stringify(data), // Convert data to JSON string
    };

    // Send the POST request and wait for the response
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Parse the response body as JSON and return the parsed data
    const responseData = await response.json();
    const status = response.status;
    return { data: responseData, status };
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error for handling at a higher level
  }
}
