import { getTokenImagePath, utcToLocalTime } from "@/lib/helpers";
import { getTicketsCountByRaffle } from "@/lib/service";
import { Raffle } from "@/lib/types/dbTypes";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import Countdown from "react-countdown";
import { Button } from "../../ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function RaffleCard({
  raffle,
  featured,
}: {
  raffle: Raffle;
  featured: boolean;
}) {
  // const { data: ticketCount } = useQuery({
  //   queryKey: ["count", raffle.id],
  //   queryFn: () => {
  //     return getTicketsCountByRaffle(raffle.id as string);
  //   },
  //   enabled: raffle !== null,
  // });
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
        className={`flex group flex-col h-full w-full relative rounded-2xl gap-4 overflow-hidden bg-neutral500`}
      >
        <div className="absolute z-30 left-4 top-4">
          <div
            className={`px-3 text-white rounded-lg bg-black/50  ${raffle?.winnerId ? "bg-brand text-white" : ""
              }`}
          >
            <Countdown
              date={utcToLocalTime(raffle.endDateUnix)}
              renderer={renderer}
            />
          </div>
        </div>
        <div className="relative">
          <AspectRatio ratio={1}>
            <Image
              src={raffle.inscriptionPreviewUrl}
              alt="Profile"
              height={288}
              width={288}
              className={`object-contain rounded-xl z-10 h-full w-full `}
            />
          </AspectRatio>
          <p className={`absolute bottom-0 right-0 bg-brand font-bold p-2 rounded-tl-xl group-hover:bg-neutral-50 group-hover:text-neutral-800 transition-colors duration-300 rounded-br-xl ${featured ? "block" : "hidden"}`}>Featured</p>
        </div>
        <div className="w-full px-6 overflow-hidden text-xl text-neutral100 font-semibold h- group-hover:text-neutral-50">
          {raffle.name}
        </div>
        <div className="flex flex-row gap-3 px-6 text-lg text-white">
          <Image
            width={24}
            height={24}
            alt="BTC"
            src={getTokenImagePath(raffle.sellingTokenTicker)}
          />

          <p className="text-lg font-bold">
            {raffle.price} {raffle.sellingTokenTicker}
          </p>
        </div>
        <div className="flex flex-row w-full gap-3 px-6 overflow-hidden h-7">
          <Image src={"ticket.svg"} alt="ticket" width={24} height={24} />
          <p className="text-lg text-white font-bold">
            {raffle?.ticket_count} sold
          </p>
        </div>
        <div className="hidden animate-slide-up group-hover:block p-5 absolute bottom-0 w-full h-[8vh] bg-neutral500">          
        <Button
            className="z-10 mb-5 w-full bg-brand hover:bg-brand/80 hover:transition-opacity hover:duration-300"
          >
            <p>{raffle?.winnerId ? "Claim inscription" : "View"}</p>
          </Button>
        </div>
      </div>
    </Link>
  );
}

