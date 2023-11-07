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
    <div className="flex flex-col w-full px-3 pt-3 pb-5 text-center text-white border-2 rounded-xl raffle-gradient border-brand">
      <Image
        className="rounded-lg w-full h-full md:w-[256px] md:h-[256px] mx-auto mb-5"
        src={raffleDetail?.inscriptionPreviewUrl}
        alt="Inscription image"
        width={`2000000`}
        height={`2000000`}
      />
      <h1 className="mb-5 text-2xl font-bold">{raffleDetail.name}</h1>
      {raffleDetail?.inscriptionNumber && (
        <h1 className="mb-5 text-cartDesktop font-bold">
          {raffleDetail?.inscriptionNumber}
        </h1>
      )}
      {/* <h1 className="mb-5 text-cartDesktop"></h1> */}
      <Button variant={"secondary"} className="mx-3">
        <Countdown
          date={utcToLocalTime(raffleDetail.endDate)}
          renderer={renderer}
        />
      </Button>
    </div>
  );
}
