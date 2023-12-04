import { create } from "zustand";

type WalletState = {
  isConnected: boolean;
  setConnected: (isConnected: boolean) => void;
  connectedAddress: string;
  setConnectedAddress: (connectedAddress: string) => void;
};

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  setConnected: () =>
    set((state) => ({ ...state, isConnected: !state.isConnected })),
  connectedAddress: "",
  setConnectedAddress: (data) =>
    set((state) => ({ ...state, connectedAddress: data })),
}));

type TicketState = {
  ticketAmount: number;
  setTicketAmount: (ticketAmount: number) => void;
};

export const useTicketStore = create<TicketState>((set) => ({
  ticketAmount: 1,
  setTicketAmount: (data) => set((state) => ({ ...state, ticketAmount: data })),
}));
