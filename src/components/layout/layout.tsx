import { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Chakra_Petch } from "next/font/google";
import { isMobile } from "react-device-detect";
import MobileOnlyScreen from "../section/mobile-only";
import MaintainanceScreen from "../section/maintainance";
import Image from "next/image";

const chakra = Chakra_Petch({ subsets: ["latin"], weight: ["400", "700"] });
const subClass = chakra.className;

export default function Layout({ children }: { children: ReactNode }) {
  // if (isMobile) {
  //   return <MaintainanceScreen />;
  // } else {
  //   return <MaintainanceScreen />;
  // }
  return (
    <>
      <div
        className={`flex flex-col w-full h-full  min-h-screen max-w-[1440px] mx-auto ${subClass}`}
      >
        <Navbar />
        <Image
          src="/bg.svg"
          height={1440}
          width={1440}
          className="z-0 select-none top-gradient"
          alt="bg"
        />
        <div className="pt-16  px-[112px] pb-40 mb-[144px] z-10">
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}
