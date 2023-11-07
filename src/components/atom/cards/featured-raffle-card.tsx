import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import { Raffle } from "@/lib/types/dbTypes";

export default function FeaturedRaffleCard({ ins }: { ins: Raffle }) {
  return (
    <div className="px-8 swiper-slide">
      <div className="w-full mx-auto h-[432px] border-2 rounded-2xl border-lightblue flex flex-row p-6 gap-10 bg-two-vector bg-cover relative">
        <div className="absolute top-0 right-0 m-6 bg-secondary-less border rounded border-secondaryLinear w-[168px] h-[44px] grid place-items-center">
          <div className="text-xl font-normal">25H : 45M : 12S</div>
        </div>

        <div className="absolute bottom-0 right-0 m-6 w-[280px]">
          <Button variant="featured" className="w-full featured-gradient ">
            Buy ticket
          </Button>
        </div>
        <Image
          alt="featured Raffle"
          width={384}
          height={384}
          src={ins.inscriptionPreviewUrl}
          className=" rounded-2xl"
        />

        <div className="flex flex-col gap-5">
          <div className="w-full h-full">
            <div className="flex flex-col">
              <h1 className="mt-8 text-featured">{ins.name}</h1>
              {/* <p className="text-blue-400 text-blueTitle">{ins.name}</p> */}
            </div>
          </div>
          <div className="w-full h-full">
            <p className="text-xl">{ins.description}</p>
          </div>
          <div className="flex flex-col w-full h-full gap-3">
            <div className="flex flex-row gap-3 text-2xl">
              <Image width={32} height={32} src={"bitcoin.svg"} alt="bitcoin" />
              <p>{ins.price}</p>
            </div>
            <div className="flex flex-row gap-3 text-2xl">
              <Image width={32} height={32} src={"ticket.svg"} alt="ticket" />
              <p>128 sold</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
