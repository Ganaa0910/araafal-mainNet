import { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Chakra_Petch } from "next/font/google";

const chakra = Chakra_Petch({ subsets: ["latin"], weight: ["400", "700"] });
const subClass = chakra.className;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`flex flex-col w-full min-h-screen max-w-[1216px] mx-auto ${subClass}`}
    >
      <Navbar />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
