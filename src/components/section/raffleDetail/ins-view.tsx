import { Button } from "@/components/ui/button";
import Image from "next/image";
import raffle from "../../../../raffleDetails.json";

export default function ViewInscription({ raffleDetail }) {
  const inscriptionDetailUrl = `https://ordinals.com/inscription/${raffle.prize.id}`;
  const incsriptionImageUrl = `https://ordinals.com/content/${raffle.prize.id}`;
  const incsriptionPreviewUrl = `https://ordinals.com/preview/${raffle.prize.id}`;

  return (
    <div className="flex flex-col w-full px-3 pt-3 pb-5 text-center text-white border-2 rounded-xl raffle-gradient border-primaryBrand">
      <Image
        className="rounded-lg w-full h-full md:w-[256px] md:h-[256px] mx-auto mb-5"
        src={raffleDetail?.inscriptionPreviewUrl}
        alt="Inscription image"
        width={`2000000`}
        height={`2000000`}
      />
      <h1 className="text-2xl font-medium">PepePunk</h1>
      <h1 className="text-cartDesktop mb-5">NO.12</h1>
      <Button variant={"secondary"} className="mx-3">
        {" "}
        25H : 45M : 12S
      </Button>
      {/* <div className="flex flex-col justify-center gap-3 mt-2">
        <button
          className="w-full text-base bg-defaultGray border-lightGray md:w-64 hover:bg-darkerLightGray hover:border-lightGray"
          onClick={() => window.open(inscriptionDetailUrl, "_blank")}
        >
          View Inscription
        </button>
      </div> */}
    </div>
  );
}
