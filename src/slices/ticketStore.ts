import { create } from "zustand";

type TicketState = {
  ticketAmount: number;
  setTicketAmount: (ticketAmount: number) => void;
};

export const useTicketStore = create<TicketState>((set) => ({
  ticketAmount: 1,
  setTicketAmount: (data) => set((state) => ({ ...state, ticketAmount: data })),
}));
