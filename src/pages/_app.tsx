import "@/styles/globals.css";

import MainHead from "@/components/layout/main-head";
import { Provider } from "react-redux";
import { store } from "../slices/store";

import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
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
