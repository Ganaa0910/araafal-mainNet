import React from "react";
import Image from "next/image";
import { Raffle } from "@/lib/types/dbTypes";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getTicketsCountByRaffle } from "@/lib/service";

export default function CreatedRaffleCard({
  raffle,
  onClaimButtonClick,
  setClaimingTicket,
}: {
  raffle: Raffle;
  onClaimButtonClick: () => void;
  setClaimingTicket: (raffle: string | null) => void;
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
  return (
    <div className="h-auto overflow-hidden border shadow-lg rounded-2xl">
      <div>
        <div className="absolute px-3 py-1 mt-3 ml-3 bg-black bg-opacity-50 border rounded-lg select-none">
          {raffle.status}
        </div>
        <div className="rounded-lg">
          <Image
            className={`object-cover w-full h-70 rounded-xl ${
              raffle?.featured ? " shadow-shadowFeatured" : "shadow-shadowBrand"
            }`}
            width={300}
            height={300}
            src={raffle.inscriptionPreviewUrl}
            alt="Card"
          />
        </div>
      </div>
      <p className="px-6 pt-2 font-bold text-gray-300">{raffle.name}</p>
      <p className="px-6 pt-2 font-bold text-gray-300">
        {raffle.price} {raffle.sellingTokenTicker}
      </p>
      <p className="flex gap-3 px-6 pt-2 font-bold text-gray-300">
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
      </p>
      {raffle.status == "RAFFLE_ENDED" && (
        <div className="flex flex-col gap-2 p-2 px-6">
          <Button variant={"primary"} onClick={handleButtonClick}>
            Claim reward
          </Button>
          <Button variant={"secondary"} onClick={() => handleViewClick()}>
            {raffle?.winnerId
              ? `Winner : ${raffle?.winnerId?.slice(0, 4)}...
                  ${raffle?.winnerId?.slice(-5)}`
              : "Ended without winner"}
          </Button>
        </div>
      )}
      {raffle.status == "RAFFLE_RUNNING" && (
        <div className="flex flex-col gap-2 p-2 px-6">
          <Button variant={"secondary"} onClick={() => handleViewClick()}>
            View
          </Button>
          <Button variant={"plain"}>Cancel</Button>
        </div>
      )}
      {raffle.status == "RAFFLE_ONHOLD" && (
        <div className="flex flex-col gap-2 p-2 px-6">
          <Button variant={"secondary"} disabled>
            View
          </Button>
          <Button variant={"plain"} disabled>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
