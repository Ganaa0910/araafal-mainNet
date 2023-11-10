import { Button } from "@/components/ui/button";
import { utcToLocalTime } from "@/lib/helpers";
import { getTicketsCountByRaffle } from "@/lib/service";
import { Raffle } from "@/lib/types/dbTypes";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import Countdown from "react-countdown";

export default function CreatedRaffleCard({
  raffle,
  onClaimButtonClick,
  setClaimingTicket,
  isPublic,
}: {
  raffle: Raffle;
  onClaimButtonClick: () => void;
  setClaimingTicket: (raffle: string | null) => void;
  isPublic?: boolean;
}) {
  const router = useRouter();
  const { data: ticketCount } = useQuery({
    queryKey: ["count", raffle.id],
    queryFn: () => {
      return getTicketsCountByRaffle(raffle.id as string);
    },
    enabled: raffle !== null,
  });
  const handleViewClick = () => {
    router.push(`/raffles/${raffle.id}`);
  };
  const handleButtonClick = () => {
    setClaimingTicket(raffle?.ticketPrivateKey);
    onClaimButtonClick();
  };
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
    <div className="flex flex-col h-auto gap-4 overflow-hidden border shadow-lg rounded-2xl text-whiteish">
      <div>
        {raffle.status == "RAFFLE_ONHOLD" && (
          <div className="absolute z-30 px-3 py-1 mt-3 ml-3 border rounded-lg select-none bg-black/50">
            Pending...
          </div>
        )}
        {raffle.status == "RAFFLE_ENDED" && (
          <div className="absolute z-30 px-3 py-1 mt-3 ml-3 border rounded-lg select-none border-brand bg-black/50">
            Ended
          </div>
        )}
        {raffle.status == "RAFFLE_RUNNING" && (
          <div
            className={`absolute px-3 py-1 mt-3 ml-3 border z-30 text-white rounded-lg bg-black/50  ${
              raffle?.featured ? "border-secondaryLinear" : "border-brand"
            }`}
          >
            <Countdown
              date={utcToLocalTime(raffle.endDate)}
              renderer={renderer}
            />
          </div>
        )}
        <div className="rounded-lg">
          <Image
            className={`object-cover w-full h-72 rounded-xl ${
              raffle?.featured ? " shadow-shadowFeatured" : "shadow-shadowBrand"
            }`}
            width={300}
            height={300}
            src={raffle.inscriptionPreviewUrl}
            alt="Card"
          />
        </div>
      </div>
      <h3 className="px-6 text-xl font-bold">{raffle.name}</h3>
      <p className="px-6 font-bold ">
        {raffle.price} {raffle.sellingTokenTicker}
      </p>
      <div className="flex gap-3 px-6 font-bold ">
        <div className="w-6 h-6">
          <Image
            alt="ticket"
            src={"/ticket.svg"}
            width={24}
            height={24}
            className="w-full h-full"
          />
        </div>
        {ticketCount?.count} sold
      </div>
      {raffle.status == "RAFFLE_ENDED" && (
        <div className="flex flex-col gap-2 px-6 pb-4">
          {!isPublic &&
            (ticketCount?.count !== 0 ? (
              <Button variant={"primary"} onClick={handleButtonClick}>
                Claim reward
              </Button>
            ) : (
              <Button variant={"secondary"} onClick={handleButtonClick}>
                Ended
              </Button>
            ))}

          {isPublic ? (
            <Button variant={"primary"} onClick={handleViewClick}>
              View
            </Button>
          ) : (
            <Button variant={"secondary"} onClick={handleViewClick}>
              {raffle?.winnerId
                ? `Winner : ${raffle?.winnerId?.slice(0, 4)}...
          ${raffle?.winnerId?.slice(-5)}`
                : ticketCount?.count !== 0
                ? "Ended without winner"
                : "No ticket sold"}
            </Button>
          )}
        </div>
      )}
      {!isPublic && (
        <>
          {raffle.status == "RAFFLE_RUNNING" && (
            <div className="flex flex-col gap-2 px-6 pb-4">
              <Button variant={"secondary"} onClick={() => handleViewClick()}>
                View
              </Button>
              <Button variant={"plain"}>Cancel</Button>
            </div>
          )}
          {raffle.status == "RAFFLE_ONHOLD" && (
            <div className="flex flex-col gap-2 px-6 pb-4">
              <Button variant={"secondary"} disabled>
                View
              </Button>
              <Button variant={"plain"} disabled>
                Cancel
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
