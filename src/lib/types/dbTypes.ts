declare global {
  interface Window {
    unisat: any; // Replace 'any' with the actual type if you know it
  }
}

export enum RaffleStatus {
  RAFFLE_ONHOLD,
  RAFFLE_RUNNING,
  RAFFLE_ENDED,
  RAFFLE_CANCELED,
}

export enum TransactionStatus {
  TRANSACTION_UNCONFIRMED,
  TRANSACTION_CONFIRMED,
  TRANSACTION_FAILED,
}

export enum TransactionType {
  FEATURED_TRANSACTION,
  TICKET_TRANSACTION,
  RAFFLE_TRANSACTION,
  AUCTION_TRANSACTION,
  WINNER_RAFFLE_TRANSACTION,
  WINNER_AUCTION_TRANSACTION,
}

export type EmailAddress = {
  id: number;
  email: string;
  createdAt: Date | null;
};

export type Raffle = {
  id: string | undefined;
  name: string;
  description: string;
  createdAt: Date | null;
  price: number;
  sellingTokenTicker: string | undefined;
  sellingTicketLimit: number;
  featured: boolean;
  endDate: Date;
  startDate: Date;
  status: RaffleStatus | undefined;
  inscriptionId: string;
  inscriptionPreviewUrl: string;
  ownerId: string;
  winnerId: string | null;
  featuredTransanctionId: string | null;
  nftDepositTransactionId: string | null;
  nftDepositAddress: string | null;
  nftPrivateKey: string | null;
  ticketDepositAddress: string | null;
  ticketPrivateKey: string | null;
  featuredTransaction: Transaction | null;
  nftTransaction: Transaction | null;
  owner: User;
  winner: User | null;
  Ticket: Ticket[];
};

export type Ticket = {
  id: string;
  createdAt: Date;
  userId: string;
  transactionId: string;
  raffleId: string;
  raffle: Raffle;
  Transaction: Transaction;
  User: User;
};

export type Transaction = {
  id: number;
  transactionId: string;
  createdAt: Date;
  status: TransactionStatus;
  userId: string;
  token_ticker: string;
  transactionNonce: string;
  transactionType: TransactionType;
  Raffle: Raffle | null;
  Ticket: Ticket | null;
  User: User;
};

export type User = {
  walletAddress: string;
  userName: string | null;
  profileInscriptionLink: string | null;
  twitterHandle: string | null;
  discordHandle: string | null;
  createdAt: Date;
  myRaffle: Raffle[];
  winnedRaffle: Raffle[];
  RefreshTokens: RefreshToken[];
  Ticket: Ticket[];
  Transaction: Transaction[];
};

export type RefreshToken = {
  id: string;
  hashedToken: string;
  userId: string;
  revoked: boolean;
  createdAt: Date;
  updatedAt: Date;
  User: User;
};
