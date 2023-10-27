import "@/styles/globals.css";

import Head from "next/head";
import Layout from "@/components/layout/layout";

import { Provider, useDispatch } from "react-redux";
import { store } from "../slices/store";
import MainHead from "@/components/layout/main-head";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { checkTokens } from "@/lib/fetcherFunctions/postRequest";
import { getAccessToken, getRefreshToken, saveToken } from "@/lib/auth";
import { setAddress, setConnected } from "@/slices/mainSlice";
import { Toaster } from "@/components/ui/toaster";
// import type { AppProps } from 'next/app'

const queryClient = new QueryClient();
export default function App({ Component, pageProps }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MainHead />
          <Component {...pageProps} />
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
        </Provider>
      </QueryClientProvider>
    </>
  );
}
