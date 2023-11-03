import { getTokenImagePath, utcToLocalTime } from "@/lib/helpers";
import { getTicketsCountByRaffle } from "@/lib/service";
import { Raffle } from "@/lib/types/dbTypes";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import Countdown from "react-countdown";
import { Button } from "../../ui/button";

export default function RaffleCard({
  raffle,
  featured,
}: {
  raffle: Raffle;
  featured: boolean;
}) {
  const { data: ticketCount } = useQuery({
    queryKey: ["count", raffle.id],
    queryFn: () => {
      return getTicketsCountByRaffle(raffle.id as string);
    },
    enabled: raffle !== null,
  });
  // const isEnded = moment().isAfter(moment(raffle.endDate));
  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
      // Render a completed state
      return <div className="">Ended</div>;
    } else {
      // Render a countdown
      return (
        <div className="">
          {hours}H : {minutes}M : {seconds}S
        </div>
      );
    }
  };

  return (
    <Link href={`/raffles/${raffle.id}`}>
      <div
        className={`flex flex-col h-[488px] w-full border-2 relative rounded-2xl gap-4 overflow-hidden ${
          featured ? "border-secondaryLinear bg-neutral600" : "border-brand"
        }`}
      >
        <div className="absolute z-30 left-4 top-4">
          <div
            className={`px-3 border text-white rounded-lg bg-black/50  ${
              featured ? "border-secondaryLinear" : "border-brand"
            }`}
          >
            <Countdown
              date={utcToLocalTime(raffle.endDate)}
              renderer={renderer}
            />
          </div>
        </div>
        <Image
          src={raffle.inscriptionPreviewUrl}
          alt="Profile"
          height={288}
          width={288}
          className={`object-contain w-full rounded-xl z-10 max-h-[288px] ${
            featured ? " shadow-shadowFeatured" : "shadow-shadowBrand"
          }`}
        />
        <div className="w-full px-6 overflow-hidden text-xl font-semibold h-7">
          {raffle.name}
        </div>
        <div className="flex flex-row gap-3 px-6 text-lg text-white">
          <Image
            width={24}
            height={24}
            alt="BTC"
            src={getTokenImagePath(raffle.sellingTokenTicker)}
          />

          <p className="text-lg">
            {raffle.price} {raffle.sellingTokenTicker}
          </p>
        </div>
        <div className="flex flex-row w-full gap-3 px-6 overflow-hidden h-7">
          <Image src={"ticket.svg"} alt="ticket" width={24} height={24} />
          <p className="text-lg font-normal text-white">
            {ticketCount?.count} sold
          </p>
        </div>
        <Button
          variant={featured ? "featured" : "primary"}
          className="z-10 mx-5 mb-5"
        >
          View
        </Button>
      </div>
    </Link>
  );
}
