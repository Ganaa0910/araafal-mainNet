import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { utcToLocalTime } from "@/lib/helpers";
import { Raffle } from "@/lib/types/dbTypes";
import moment from "moment";
import Image from "next/image";
import Countdown from "react-countdown";

export default function ViewInscription({
  raffleDetail,
}: {
  raffleDetail: Raffle;
}) {
  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
      // Render a completed state
      return <div>Ended</div>;
    } else {
      // Render a countdown
      return (
        <div>
          {hours}H : {minutes}M : {seconds}S
        </div>
      );
    }
  };
  return (
    <div className="flex flex-col w-full px-3 pt-3 pb-5 text-center text-white rounded-xl bg-neutral-800 ">
      <AspectRatio ratio={1}>
        <Image
          className="w-full h-full mx-auto rounded-lg"
          src={raffleDetail?.inscriptionPreviewUrl}
          alt="Inscription image"
          width={256}
          height={256}
        />
      </AspectRatio>
      <h1 className="text-xl font-light text-neutral-300 p-2">{raffleDetail.name}</h1>
      {raffleDetail?.inscriptionNumber && (
        <h1 className="text-cartDesktop mb-3">
          NO. {raffleDetail?.inscriptionNumber}
        </h1>
      )}
      {/* <h1 className="mb-5 text-cartDesktop"></h1> */}
      <Button variant={"plain"} className="mx-3 border-none bg-neutral-950 font-medium">
        <Countdown
          date={utcToLocalTime(raffleDetail.endDateUnix)}
          renderer={renderer}
        />
      </Button>
    </div>
  );
}
