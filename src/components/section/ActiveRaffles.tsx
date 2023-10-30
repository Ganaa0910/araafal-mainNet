import { Button } from "@/components/ui/button";
import { Raffle } from "@/lib/types/dbTypes";
import Image from "next/image";
import Link from "next/link";
import RaffleCard from "../atom/cards/raffle-card";
import PageTitle from "../atom/page-title";
export default function ActiveRaffles({
  data,
}: {
  data: Raffle[] | undefined;
}) {
  return (
    <div className="">
      <div className="w-[1216px] mx-auto justify-start items-center">
        <PageTitle name="Active Raffles" />
        <div className="grid grid-cols-4 gap-4">
          {data?.map((ins) => (
            <div key={ins.id}>
              <RaffleCard raffle={ins} />
            </div>
          ))}
        </div>
        {/* <div className="flex flex-col md:flex-row gap-9">
                <ViewInscription />
                <InfoSection />
              </div>

              <div className="flex flex-col gap-8 md:flex-row">
                <InscriptionDetails />
                <BuyPanel tokens={tokens} />
                <Leaderboard tokens={tokens} getAddressDetail={getAddressDetail} />
              </div> */}
      </div>
    </div>
  );
}
