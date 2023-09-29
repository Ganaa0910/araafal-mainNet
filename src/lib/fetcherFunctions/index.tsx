import { Raffle, User } from "../types/dbTypes"
import axios from "axios"

const apiKey = process.env.UNISAT_API_KEY
const apiUrl = 'https://open-api.unisat.io'

const APIURL =
    process.env.NODE_ENV == 'production' ? '' : 'http://localhost:3001'

interface Transaction {
    transactionId: string;
    userId: string;
    raffleId?: string; // This is an optional field, as you mentioned
    transactionData: {
        transactionNonce: string;
        transactionType: string;
        token_ticker: string;
    };
}

export async function fetchRaffles():Promise <Raffle[]> {
    const response = await fetch(`${APIURL}/api/raffles`)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json()
}

export async function fetchRaffleById(id:string):Promise <Raffle>  {
    const response = await fetch(`${APIURL}/api/raffles/${id}`)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json()
}

export async function getTicketsByUser(id:string) {
    const response = await fetch(`${APIURL}/api/tickets/user/${id}`)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json()
}

export async function getUserProfile(id:string) {
    const response = await fetch(`${APIURL}/api/users/${id}`)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json()
}

export async function getUserWonRaffles(id:string) {
    const response = await fetch(`${APIURL}/api/users/${id}/wonRaffles`)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json()
}

export async function getUserParticipated(id:string) {
    const response = await fetch(`${APIURL}/api/users/${id}/participatedRaffles`)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json()
}

export async function getInscriptions(address:string) {
    let inscriptions = []
    try {
        const response = await axios.get(`${apiUrl}/v1/indexer/tx/${address}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        })

        const utxo = response.data.utxo

        for (let i = 0; i < utxo.length; i++) {
            inscriptions.push(utxo[i].inscriptions[0])
        }

        //https://ordinals.com/preview/bbe3e8b84d9284e60337acd7c13e09c235e64ecbb087b2842118389b6f8d4c74i0 get nft content

        return inscriptions
    } catch (error) {
        console.error(error)
    }
}

export async function loginHandler({walletData }:{walletData:User}){
    try {
        const { data, status } = await makePostRequest<User>(`${APIURL}/api/users/auth`, walletData);

        if (!data || status !== 200) {
          throw new Error('Network response was not OK');
        }

        return { data, status };
      } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error for handling at a higher level
      }
}

export async function createRaffle({ newRaffleData }: { newRaffleData: Raffle }){
    try {
      const { data, status } = await makePostRequest<Raffle>(`${APIURL}/api/raffles`, newRaffleData);

      if (!data || status !== 200) {
        throw new Error('Network response was not OK');
      }

      return { data, status };
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error for handling at a higher level
    }
  }

  export async function createTicket({ newTicketData }: { newTicketData: Transaction }){
    try {
      const { data, status } = await makePostRequest<Transaction>(`${APIURL}/api/tickets`, newTicketData);

      if (!data || status !== 200) {
        throw new Error('Network response was not OK');
      }

      return { data, status };
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error for handling at a higher level
    }
  }

async function makePostRequest<T>(url: string, data: T): Promise<{ data: T; status: number }>{
    try {
      // Create a new request object
      const requestOptions = {
        method: 'POST',
        headers:  {
          'Content-Type': 'application/json', // Adjust content type as needed
        },
        body: JSON.stringify(data), // Convert data to JSON string
      };

      // Send the POST request and wait for the response
      const response = await fetch(url, requestOptions);


      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse the response body as JSON and return the parsed data
      const responseData = await response.json();
      const status = response.status;
      return { data: responseData, status };
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error for handling at a higher level
    }
  }


async function makePutRequest<T>(url: string, data: T): Promise<{ data: T; status: number }>{
    try {
      // Create a new request object
      const requestOptions = {
        method: 'PUT',
        headers:  {
          'Content-Type': 'application/json', // Adjust content type as needed
        },
        body: JSON.stringify(data), // Convert data to JSON string
      };

      // Send the POST request and wait for the response
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse the response body as JSON and return the parsed data
      const responseData = await response.json();
      const status = response.status;
      return { data: responseData, status };
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error for handling at a higher level
    }
  }