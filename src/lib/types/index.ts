export type ReduxAccount = {
  account: Account;
};

export type Account = {
  address: string;
  addresses: string[];
  connected: boolean;
  inscriptions: Record<string, any>; // You can replace 'any' with the specific type if you know the structure
  isOnCorrectNetwork: boolean;
  network: string;
};

export type ReduxTicketObject = {
  ticket: {
    amount: number;
  };
};

export type InscriptionType = {
  inscriptionId: string;
  inscriptionNumber: number;
  isBRC20: boolean;
  isOrdinal: boolean;
  moved: boolean;
  offset: number;
  sequence: number;
};

export type UserBrc20Type = {
  amount: string;
  inscriptionId: string;
  inscriptionNumber: number;
  isBRC20: boolean;
  moved: boolean;
  offset: number;
  operation: string;
  sequence: number;
  ticker: string;
  type: string;
};

export type LeaderboardEachUserType = {
  contestPoint: number;
  createdAt: Date;
  discordHandle: string | null;
  email: string | null;
  profileInscriptionLink: string | null;
  twitterHandle: string | null;
  userName: string | null;
  walletAddress: string;
};

export type TicketsByRaffle = {
  raffleId: string;
  ticketCount: string;
  userId: string;
};
