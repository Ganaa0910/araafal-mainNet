import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import ProfileTabs from "@/components/profile/profile-tabs";
import { TransactionWithTicket, getTicketsByUser } from "@/lib/service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import moment from "moment";
import Countdown from "react-countdown";

enum TicketStatus {
  TICKET_ENDED,
  TICKET_RUNNING,
  TICKET_WON,
}

const Tic = () => {
  //profile routing ends
  const router = useRouter();
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>(
    TicketStatus.TICKET_RUNNING,
  );
  const [ticketCounts, setTicketCount] = useState<{ [key: string]: number }>(
    {},
  );

  const [sortedTransactionIds, setSortedTransactionIds] = useState([]);
  const onClick = () => {
    setTicketStatus(TicketStatus.TICKET_RUNNING);
  };
  const slug = router.query.addr;

  const { data: tickets } = useQuery({
    queryKey: ["tickets", slug],
    queryFn: () => {
      if (typeof slug === "string") {
        return getTicketsByUser(slug);
      }
    },
    enabled: !!slug,
  });
  console.log("🚀 ~ file: tic.tsx:41 ~ Tic ~ tickets:", tickets);

  return (
    <Layout>
      <PageTitle name="Profile" />
      <div className="flex flex-row w-full h-auto gap-4 ">
        <ProfileTabs />

        <div className="w-[904px] min-h-[694px] flex flex-col border-2 border-brand rounded-xl px-6 pt-5 pb-6 gap-3 overflow-auto">
          <div className="flex justify-between text-2xl text-white">
            <div className="text-left">Raffle</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">End Time</div>
          </div>
          <hr className="border-brand "></hr>
          {tickets?.rows.length != 0 &&
            tickets?.rows?.map(
              (ticket: TransactionWithTicket, index: number) => {
                const isEnded = moment().isAfter(moment(ticket.endDate));
                console.log("🚀 ~ file: tic.tsx:62 ~ Tic ~ isEnded:", isEnded);
                const renderer = ({ hours, minutes, seconds, completed }) => {
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
                  <div
                    key={ticket.id}
                    className="w-full h-[116px]  rounded-lg  grid grid-cols-3 items-center"
                  >
                    <div className="flex flex-row justify-start gap-4">
                      <div className="w-[100px] h-[100px] object-contain">
                        <Image
                          width={100}
                          height={100}
                          className="w-[100px] h-full rounded-lg"
                          src={ticket?.inscriptionPreviewUrl}
                          alt="img"
                        />
                      </div>
                      <div className="flex flex-col items-center justify-center h-full">
                        <h3 className="text-xl">{ticket?.name}</h3>
                        {/* <h1>{transaction.Transaction.}</h1> */}
                      </div>
                    </div>
                    <div className="flex flex-row items-center justify-center text-left w-">
                      <h1> {ticket?.ticketCount}</h1>
                      <Image
                        src={"/ticket.svg"}
                        width={1}
                        height={1}
                        className="w-8 h-8"
                        alt="img"
                      />
                    </div>
                    <div className=" text-end">
                      {isEnded ? (
                        "Ended"
                      ) : (
                        <Countdown date={ticket.endDate} renderer={renderer} />
                      )}
                    </div>
                    {/* <div className="items-end text-left ">
                      {ticketStatus == TicketStatus.TICKET_ENDED && (
                        <button
                          className={`w-[133px] flex flex-row text-center text-2xl  bg-defaultGray border-lightGray px-[16px] py-[12px] h-auto border-white`}
                        >
                          <Image
                            src={"/claim.svg"}
                            width={1}
                            height={1}
                            className="w-6 h-6"
                          ></Image>
                          Claim
                        </button>
                      )}
                      {ticketStatus == TicketStatus.TICKET_RUNNING && (
                        <button
                          className={`w-[133px] flex flex-row text-center text-2xl  bg-defaultGray border-lightGray px-[16px] py-[12px] h-auto border-white`}
                        >
                          <Image
                            src={"/claim.svg"}
                            width={1}
                            height={1}
                            className="w-6 h-6"
                          ></Image>
                          Running
                        </button>
                      )}
                      {ticketStatus == TicketStatus.TICKET_ENDED && (
                        <button
                          className={`w-[133px] flex flex-row text-center text-2xl  bg-defaultGray border-lightGray px-[16px] py-[12px] h-auto border-white`}
                        >
                          <Image
                            src={"/claim.svg"}
                            width={1}
                            height={1}
                            className="w-6 h-6"
                          ></Image>
                          Ended
                        </button>
                      )}
                    </div> */}
                  </div>
                );
              },
            )}
        </div>
      </div>
    </Layout>
  );
};
export default Tic;

const Claim = () => {
  return (
    <button
      className={`w-[133px] flex flex-row text-center text-2xl  bg-defaultGray border-lightGray px-[16px] py-[12px] h-auto border-white`}
    >
      <Image
        src={"/claim.svg"}
        width={1}
        height={1}
        className="w-6 h-6"
      ></Image>
      Claim
    </button>
  );
};
