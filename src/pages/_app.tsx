import "@/styles/globals.css";

import { Provider, useDispatch } from "react-redux";
import { store } from "../slices/store";
import MainHead from "@/components/layout/main-head";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";

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
