declare global {
  interface Window {
    unisat: any; // Replace 'any' with the actual type if you know it
  }
}

export type EmailAddress = {
  id: number;
  email: string;
  createdAt: Date | null;
};

export type Raffle = {
  id: string | null;
  name: string;
  description: string;
  createdAt: Date | null;
  price: number;
  sellingTokenTicker: string;
  sellingTicketLimit: number;
  featured: boolean;
  endDate: string;
  endDateUnix: number;
  startDate: String;
  status: RaffleStatus | null;
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
  inscriptionNumber: string | null;
  winner: User | null;
  tickets: Ticket[] | null;
  ticket_count: number | null;
  sellingTokenImage: string | null;
};

export type Ticket = {
  id: string;
  createdAt: Date;
  userId: string;
  transactionId: string;
  raffleId: string;
  raffle: Raffle;
  transaction: Transaction;
  user: User;
};

export type Transaction = {
  id: number;
  transactionId: string;
  createdAt: Date;
  status: TransactionStatus;
  userId: string;
  tokenTicker: string;
  transactionNonce: string;
  transactionType: TransactionType;
  featuredRaffle: Raffle | null;
  depositRaffle: Raffle | null;
  tickets: Ticket[];
  user: User;
};

export type Notification = {
  id: number;
  message: string;
  read: boolean;
  userId: string;
  user: User;
};

export type User = {
  walletAddress: string;
  userName: string | null;
  profileInscriptionLink: string | null;
  twitterHandle: string | null;
  discordHandle: string | null;
  createdAt: Date;
  contestPoint: number;
  email: string | null;
  contests: ContestActivity[];
  notifications: Notification[];
  myRaffles: Raffle[];
  winnedRaffles: Raffle[];
  referral: Referral | null;
  tickets: Ticket[];
  transactions: Transaction[];
};

export type Referral = {
  id: number;
  code: string;
  uses: number;
  maxUses: number;
  userId: string;
  user: User;
};

export type Whitelist = {
  code: string;
  email: string;
  emailaddressId: number;
};

export type ContestActivity = {
  id: number;
  type: string;
  points: number;
  createdAt: Date;
  userId: string;
  user: User;
};

export type FailedRequest = {
  id: number;
  target: string;
  message: string;
  timestamp: Date;
};

export enum RaffleStatus {
  RAFFLE_ONHOLD = "RAFFLE_ONHOLD",
  RAFFLE_RUNNING = "RAFFLE_RUNNING",
  RAFFLE_ENDED = "RAFFLE_ENDED",
  RAFFLE_CANCELED = "RAFFLE_CANCELED",
}

export enum TransactionStatus {
  TRANSACTION_UNCONFIRMED = "TRANSACTION_UNCONFIRMED",
  TRANSACTION_CONFIRMED = "TRANSACTION_CONFIRMED",
  TRANSACTION_FAILED = "TRANSACTION_FAILED",
}

export enum TransactionType {
  FEATURED_TRANSACTION = "FEATURED_TRANSACTION",
  TICKET_TRANSACTION = "TICKET_TRANSACTION",
  RAFFLE_TRANSACTION = "RAFFLE_TRANSACTION",
  AUCTION_TRANSACTION = "AUCTION_TRANSACTION",
  WINNER_RAFFLE_TRANSACTION = "WINNER_RAFFLE_TRANSACTION",
  WINNER_AUCTION_TRANSACTION = "WINNER_AUCTION_TRANSACTION",
}
export type Account = {
  address: string; // Assuming `address` is a string, adjust the type accordingly if needed
};
