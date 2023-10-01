import { useRouter } from "next/router";

import Button from "@/components/Button";
import MyCreatedRaffles from "@/components/tabs/MyCreatedRaffles";
import Image from "next/image";
import ProfileTabs from "@/components/profile/profile-tabs";
import { useQuery } from "@tanstack/react-query";
import { getUserRaffles } from "@/lib/fetcherFunctions";

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
      <div className=" flex flex-row gap-4 h-auto w-full">
        <ProfileTabs />
        <div className="w-[904px] h-auto grid grid-cols-3 border border-gray-50 rounded-lg px-6 pt-5 pb-6 gap-5 overflow-auto">
          {raffles?.map((raffle) => (
            <div
              key={raffle.id}
              className="h-auto  rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                className="w-70 h-70 object-cover"
                src={raffle.inscriptionPreviewUrl}
                alt="Card"
              />
              <div className="p-2">
                <p className="text-gray-300 text-base">{raffle.name}</p>
                <p className="text-gray-300 text-base">
                  {raffle.price} {raffle.sellingTokenTicker}
                </p>
                <p className="text-gray-300 text-base">0 sold</p>
              </div>
              <div className="flex flex-col p-2 gap-2">
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
