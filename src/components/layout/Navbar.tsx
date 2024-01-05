import Image from "next/image";
import Link from "next/link";
import ConnectWalletButton from "../ConnectWalletButton";
import Router from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const isTop = window.scrollY < 20;

      setIsTop(isTop);
    });
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full backdrop-blur-sm bg-opacity-80 ${isTop ? "" : "bg-black/30"
        }`}
    >
      <div className="flex items-center justify-center flex-shrink-0 h-20 px-28 max-w-[1440px] mx-auto">
        <div className="left-0 right-auto flex items-center h-12">
          <Link href={"/"}>
            <Image
              className="h-[40px] w-[162px]"
              src={"/araafal.svg"}
              height={48}
              width={160}
              alt="araafal"
            />
          </Link>
        </div>
        <div className="flex items-center gap-3 mx-auto">
          <Link className="group transition duration-300 px-5 py-3 " href={"/createRaffle"}>
            <p className="shadow-white duration-300 text-featuredRaffles">Create Raffle</p>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-1 bg-brand"></span>
          </Link>
          <Link className="group transition duration-300 px-5 py-3" href={"/raffles"}>
            Raffles
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-1 bg-brand"></span>

          </Link>
          <Link className="group transition px-5 py-3" href={"/leaderboard"}>
            Leaderboard
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-1 bg-brand"></span>
          </Link>
        </div>
        <div className="right-0 left-auto hidden md:block">
          <div className="flex items-center gap-8">
            <div className="flex flex-row"></div>

            <div className="hidden md:block">
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
