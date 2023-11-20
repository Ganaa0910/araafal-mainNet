// TicketCard.tsx
import React from "react";
import Image from "next/image";
import Countdown from "react-countdown";
import moment from "moment";
import { TransactionWithTicket } from "@/lib/service";
import { utcToLocalTime } from "@/lib/helpers";

export default function TicketCard({
  ticket,
}: {
  ticket: TransactionWithTicket;
}) {
  console.log("🚀 ~ file: ticket-card.tsx:14 ~ ticket:", ticket);
  const isEnded = moment().isAfter(moment(ticket.endDateUnix));

  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
      return <div key={ticket.raffleId}>Ended</div>;
    } else {
      return (
        <div key={ticket.raffleId}>
          {hours}H : {minutes}M : {seconds}S
        </div>
      );
    }
  };

  return (
    <div className="w-full h-[116px] rounded-lg grid grid-cols-3 items-center">
      <div className="flex flex-row items-center justify-start gap-4 h-[100px]">
        <div className="w-[100px] h-[100px] shrink-0">
          <Image
            width={100}
            height={100}
            className="object-cover w-full h-full rounded-lg"
            src={ticket?.inscriptionPreviewUrl}
            alt="img"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-xl">{ticket?.name}</h3>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center gap-2">
        <h1 className="text-2xl"> {ticket?.ticketCount}</h1>
        <Image
          src="/images/ticketGrad.svg"
          width={1}
          height={1}
          className="w-8 h-8"
          alt="img"
        />
      </div>

      <div className="text-end">
        {isEnded ? (
          <span>Ended</span>
        ) : (
          <Countdown
            date={utcToLocalTime(ticket.endDateUnix)}
            renderer={renderer}
          />
        )}
      </div>
    </div>
  );
}
