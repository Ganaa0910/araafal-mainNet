import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
} from "redux-persist";

import { ticketReducer, accountReducer, setConnected } from "./mainSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: [""],
};

const rootReducer = combineReducers({
  ticket: ticketReducer,
  account: accountReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

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
