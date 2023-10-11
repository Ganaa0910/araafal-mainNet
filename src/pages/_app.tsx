import "@/styles/globals.css";

import Head from "next/head";
import Layout from "@/components/layout/layout";

import { Provider } from "react-redux";
import { store } from "../slices/store";
import MainHead from "@/components/layout/main-head";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import type { AppProps } from 'next/app'

const queryClient = new QueryClient();
export default function App({ Component, pageProps }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MainHead />
          {/* <Layout> */}
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
          {/* </Layout> */}
        </Provider>
      </QueryClientProvider>
    </>
  );
}
