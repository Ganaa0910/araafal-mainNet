import { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Chakra_Petch } from "next/font/google";

const chakra = Chakra_Petch({ subsets: ["latin"], weight: ["400", "700"] });
const subClass = chakra.className;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        className={`flex flex-col w-full h-full  min-h-screen max-w-[1440px] mx-auto ${subClass}`}
      >
        <Navbar />
        <div className="pt-16  px-[112px] pb-40 mb-[144px]">{children}</div>
      </div>
      <Footer />
    </>
  );
}
