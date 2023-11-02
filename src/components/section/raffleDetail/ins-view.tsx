import { Button } from "@/components/ui/button";
import Image from "next/image";
import raffle from "../../../../raffleDetails.json";
import { Raffle } from "@/lib/types/dbTypes";

export default function ViewInscription({
  raffleDetail,
}: {
  raffleDetail: Raffle;
}) {
  return (
    <div className="flex flex-col w-full px-3 pt-3 pb-5 text-center text-white border-2 rounded-xl raffle-gradient border-brand">
      <Image
        className="rounded-lg w-full h-full md:w-[256px] md:h-[256px] mx-auto mb-5"
        src={raffleDetail?.inscriptionPreviewUrl}
        alt="Inscription image"
        width={`2000000`}
        height={`2000000`}
      />
      <h1 className="text-2xl font-medium">PepePunk</h1>
      <h1 className="mb-5 text-cartDesktop">NO.12</h1>
      <Button variant={"secondary"} className="mx-3">
        25H : 45M : 12S
      </Button>
    </div>
  );
}
