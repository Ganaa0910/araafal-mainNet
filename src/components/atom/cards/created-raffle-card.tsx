import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { getTokenImagePath, utcToLocalTime } from "@/lib/helpers";
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
    <div
      className={`flex flex-col h-auto gap-4 overflow-hidden border shadow-lg rounded-2xl text-whiteish ${
        raffle?.featured
          ? "border-secondaryLinear bg-neutral600"
          : "border-brand"
      }`}
    >
      <div>
        {raffle.status == "RAFFLE_ONHOLD" && (
          <div
            className={`absolute px-3 py-1 mt-3 ml-3 border z-30 text-white rounded-lg bg-black/50  ${
              raffle?.featured ? "border-secondaryLinear" : "border-brand"
            }`}
          >
            Pending...
          </div>
        )}
        {raffle.status == "RAFFLE_ENDED" && (
          <div
            className={`absolute px-3 py-1 mt-3 ml-3 border z-30 text-white rounded-lg bg-black/50  ${
              raffle?.featured ? "border-secondaryLinear" : "border-brand"
            }`}
          >
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
              date={utcToLocalTime(raffle.endDateUnix)}
              renderer={renderer}
            />
          </div>
        )}
        <AspectRatio ratio={1}>
          <Image
            className={`object-cover w-full h-full rounded-lg  ${
              raffle?.featured ? " shadow-shadowFeatured" : "shadow-shadowBrand"
            }`}
            width={300}
            height={300}
            src={raffle.inscriptionPreviewUrl}
            alt="Card"
          />
        </AspectRatio>
      </div>
      <h3 className="px-6 text-xl font-bold">{raffle.name}</h3>
      <div className="flex flex-row gap-3 px-6 text-lg text-white">
        <Image
          width={24}
          height={24}
          alt="BTC"
          src={getTokenImagePath(raffle.sellingTokenTicker)}
        />
        <p className="font-bold ">
          {raffle.price} {raffle.sellingTokenTicker}
        </p>
      </div>
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
        {raffle?.ticket_count} sold
      </div>
      {raffle.status == "RAFFLE_ENDED" && (
        <div className="flex flex-col gap-2 px-6 pb-4">
          {!isPublic &&
            (raffle?.ticket_count !== 0 ? (
              <Button
                variant={raffle?.featured ? "featured" : "primary"}
                onClick={handleButtonClick}
              >
                Claim reward
              </Button>
            ) : (
              <Button variant={"secondary"} onClick={handleButtonClick}>
                Ended
              </Button>
            ))}

          {isPublic ? (
            <Button
              variant={raffle?.featured ? "featured" : "primary"}
              onClick={handleViewClick}
            >
              View
            </Button>
          ) : (
            <Button variant={"secondary"} onClick={handleViewClick}>
              {raffle?.winnerId
                ? `Winner : ${raffle?.winnerId?.slice(0, 4)}...
          ${raffle?.winnerId?.slice(-5)}`
                : raffle?.ticket_count !== 0
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
              <Button
                variant={raffle?.featured ? "featured" : "primary"}
                onClick={() => handleViewClick()}
              >
                View
              </Button>
              <Button variant={"plain"}>Cancel</Button>
            </div>
          )}
          {raffle.status == "RAFFLE_ONHOLD" && (
            <div className="flex flex-col gap-2 px-6 pb-4">
              <Button
                variant={raffle?.featured ? "featured" : "primary"}
                disabled
              >
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
