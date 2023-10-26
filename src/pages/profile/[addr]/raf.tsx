import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import MyCreatedRaffles from "@/components/tabs/MyCreatedRaffles";
import Image from "next/image";
import ProfileTabs from "@/components/profile/profile-tabs";
import { useQuery } from "@tanstack/react-query";
import { getUserRaffles } from "@/lib/fetcherFunctions";

import DummyRaffles from "../../../components/DummyRaffle.json";

export default function Raf() {
  //profile routing ends
  const router = useRouter();

  const slug = router.query.addr;
  const { data: raffles } = useQuery({
    queryKey: ["raffleTitle", slug],
    queryFn: () => {
      if (typeof slug === "string") {
        return getUserRaffles(slug);
      }
    },
    enabled: !!slug,
  });

  return (
    <div className="max-w-[1216px] mx-auto">
      {/* <div className="py-[48px] md:py-[64px] px-4 md:px-[40px] w-full grid grid-cols-1 gap-8 justify-start items-center bg-red-600"> */}
      <div className="flex flex-row w-full h-auto gap-4 ">
        <ProfileTabs />
        <div className="w-[904px] h-auto grid grid-cols-3 border border-gray-50 rounded-lg px-6 pt-5 pb-6 gap-5 overflow-auto">
          {DummyRaffles?.map((raffle) => (
            <div
              key={raffle.id}
              className="h-auto overflow-hidden shadow-lg rounded-2xl border"
            >
              <div>
                <div className="px-3 py-1 absolute border rounded-lg bg-black bg-opacity-50 mt-3 ml-3">
                  {raffle.status}
                </div>
                <div className="rounded-lg">
                  <img
                    className="object-cover w-70 h-70"
                    src={raffle.inscriptionPreviewUrl}
                    alt="Card"
                  />
                </div>
              </div>
              <p className="pt-2 px-6 font-bold text-gray-300">{raffle.name}</p>
              <p className="pt-2 px-6 font-bold text-gray-300">
                {raffle.price} {raffle.sellingTokenTicker}
              </p>
              <p className="pt-2 px-6 font-bold text-gray-300">
                {raffle.soldAmount} sold
              </p>
              <div className="flex flex-col gap-2 p-2 px-6">
                <Button>View</Button>
                <Button>Cancel</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
