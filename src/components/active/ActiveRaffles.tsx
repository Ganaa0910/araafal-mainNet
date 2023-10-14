import { Button } from "@/components/ui/button";
import { Raffle } from "@/lib/types/dbTypes";
import Image from "next/image";
import Link from "next/link";
export default function ActiveRaffles({
  data,
}: {
  data: Raffle[] | undefined;
}) {
  return (
    <div className="max-w-[1400px] mx-auto mb-40">
      <div className="w-[1216px] mx-auto justify-start items-center">
        <div className="flex flex-col mb -12 mb-12">
          <h1 className="text-featuredRaffles text-4xl">Active Raffles</h1>
          <span className="bg-gradient-to-r from-orange-300 to-orange-600 inline-block w-24 h-2"></span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {data?.map((ins) => (
            <Link key={ins.id} href={`/raffles/${ins.id}`}>
              <div className="flex flex-col h-[488 px] w-full border-2 border-primaryBrand rounded-xl gap-4 overflow-hidden">
                <div className="">
                  <Image
                    src={ins.inscriptionPreviewUrl}
                    alt="Profile"
                    height={280}
                    width={280}
                    className="w-full object-contain rounded-lg shadow-shadowBrand"
                  />
                </div>
                <div className="text-xl font-semibold px-6 w-full h-7 overflow-hidden">
                  {ins.name}
                </div>
                <div className="text-white text-lg px-6 flex flex-row gap-3">
                  <Image width={24} height={24} alt="BTC" src={"bitcoin.svg"} />

                  <p className="text-lg">{ins.price} BTC</p>
                </div>
                <div className="px-6 w-full h-7 overflow-hidden flex flex-row gap-3">
                  <Image
                    src={"ticket.svg"}
                    alt="ticket"
                    width={24}
                    height={24}
                  />
                  <p className="text-lg font-normal text-white">69 sold</p>
                </div>
                <Button variant={"primary"}>View</Button>
              </div>
            </Link>
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
