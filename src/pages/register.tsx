import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Register() {
  return (
    <>
      <nav className="absolute top-0 left-0 z-50">
        <div className="flex items-center justify-center flex-shrink-0 h-20 px-28">
          <div className="flex items-center h-12">
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
        </div>
      </nav>
      <div
        className={`flex h-screen max-w-[1440px] mx-auto -mt-20 flex-col items-center justify-center`}
      >
        <div className="relative w-full h-24">
          <Image
            src={"/mesh.svg"}
            height={600}
            width={1440}
            className="absolute left-0 right-0 object-none 2xl:object-contain  w-full top-0 h-[177px] md:h-auto"
            alt="mesh"
          />
          <div className="flex items-center justify-center h-full text-3xl font-bold text-center select-none md:text-6xl">
            <div>
              Welcome ma early birdy bro Enjoy{" "}
              <span className="text-[#FD7C5B]">Testnet!</span>
            </div>
          </div>
        </div>
        <div className="pt-8 text-2xl select-none md:text-4xl">Coming soon</div>

        <div className="bg-[#FD7C5B] flex h-[48px] w-[322px] rounded-lg ">
          <input
            type="email"
            className="flex-1 py-3 px-6  rounded-lg text-base md:text-xl bg-black/50   text-[#C4C3C2] placeholder-gray-300 placeholder-opacity-50 focus:ring-0 focus:border-gray-500 "
            placeholder="Email address"
          />
        </div>
      </div>
    </>
  );
}
