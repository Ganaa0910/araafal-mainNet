import { Raffle } from "@/lib/types/dbTypes";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../ui/button";

export default function RaffleCard({ raffle }: { raffle: Raffle }) {
  return (
    <Link href={`/raffles/${raffle.id}`}>
      <div className="flex flex-col h-[488 px] w-full border-2 border-brand rounded-2xl gap-4 overflow-hidden">
        <div className="">
          <Image
            src={raffle.inscriptionPreviewUrl}
            alt="Profile"
            height={280}
            width={280}
            className="object-contain w-full rounded-xl shadow-shadowBrand"
          />
        </div>
        <div className="w-full px-6 overflow-hidden text-xl font-semibold h-7">
          {raffle.name}
        </div>
        <div className="flex flex-row gap-3 px-6 text-lg text-white">
          <Image width={24} height={24} alt="BTC" src={"bitcoin.svg"} />

          <p className="text-lg">{raffle.price} BTC</p>
        </div>
        <div className="flex flex-row w-full gap-3 px-6 overflow-hidden h-7">
          <Image src={"ticket.svg"} alt="ticket" width={24} height={24} />
          <p className="text-lg font-normal text-white">69 sold</p>
        </div>
        <Button variant={"primary"} className="mx-5 mb-5 z-10">
          View
        </Button>
      </div>
    </Link>
  );
}
