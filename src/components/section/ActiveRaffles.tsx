import { Raffle } from "@/lib/types/dbTypes";
import Link from "next/link";
import RaffleCard from "../atom/cards/raffle-card";
import PageTitle from "../atom/page-title";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
export default function ActiveRaffles({
  data,
}: {
  data: Raffle[] | undefined;
}) {
  return (
    <div className="">
      <div className="w-[1216px] mx-auto justify-start items-center">
        <div className="flex flex-row items-center justify-between h-auto">
          <PageTitle name="Active Raffles" />
          <Button variant={"ghost"}>
            <Link
              className="px-5 py-3 flex flex-row text-2xl font-bold items-center"
              href={"/raffles"}
            >
              See all <Icons.chevronRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>

        {/* this will only show last 8 ins */}
        <div className="grid grid-cols-4 gap-4">
          {data?.slice(-8).map((ins) => (
            <div key={ins.id}>
              <RaffleCard raffle={ins} />
            </div>
          ))}
        </div>
        {/* <div className="grid grid-cols-4 gap-4">
          {data?.map((ins) => (
            <div key={ins.id}>
              <RaffleCard raffle={ins} />
            </div>
          ))}
        </div> */}
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
