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
              className="flex flex-row items-center px-5 py-3 text-2xl font-bold"
              href={"/raffles"}
            >
              See all <Icons.chevronRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>

        {/* this will only show last 8 ins */}
        <div className="grid grid-cols-4 gap-4">
          {data?.length !== 0 &&
            data
              ?.filter((ins) => ins.featured === false)
              .reverse()
              .slice(-8)
              .reverse()
              .map((ins) => (
                <div key={ins.id}>
                  <RaffleCard raffle={ins} featured={false} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
