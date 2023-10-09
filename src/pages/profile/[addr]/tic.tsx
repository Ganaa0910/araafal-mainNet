import Button from "@/components/Button";
import ProfileTabs from "@/components/profile/profile-tabs";
import {
  TransactionWithTicket,
  getTicketsByUser,
} from "@/lib/fetcherFunctions";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
    queryKey: ["raffleTitle", slug],
    queryFn: () => {
      if (typeof slug === "string") {
        return getTicketsByUser(slug);
      }
    },
    enabled: !!slug,
  });

  // Group transactions by transactionId and count them
  const groupedTransactions: Record<
    string,
    { ticket: TransactionWithTicket[]; count: number }
  > = tickets?.reduce((grouped, ticket) => {
    const transactionId = ticket.Transaction?.transactionId;
    if (!grouped[transactionId]) {
      grouped[transactionId] = {
        transactions: [],
        count: 0,
      };
    }
    grouped[transactionId].transactions.push(ticket);
    grouped[transactionId].count++;
    return grouped;
  }, {});

  // Sort the grouped transactions by transactionId
  useEffect(() => {
    if (groupedTransactions) {
      const sortedTransactionIds = Object.keys(groupedTransactions).sort();
      setSortedTransactionIds(sortedTransactionIds);
    }
  }, [groupedTransactions]);

  return (
    <div className="max-w-[1216px] mx-auto flex flex-row">
      <div className=" flex flex-row gap-4 h-auto w-full">
        <ProfileTabs />

        <div className="w-[904px] min-h-[694px] flex flex-col border border-gray-50 rounded-lg px-6 pt-5 pb-6 gap-5 overflow-auto">
          <div className="text-grey-300 text-2xl flex justify-between">
            <div className="text-left">Raffle</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">End Time</div>
          </div>
          <hr></hr>
          {sortedTransactionIds?.map((transactionId) => (
            <div key={transactionId}>
              {/* <h3>Transaction ID: {transactionId}</h3>
              <p>Count: {groupedTransactions[transactionId].count}</p> */}
              {groupedTransactions[transactionId]?.transactions.map(
                (transaction: TransactionWithTicket, index: number) =>
                  index == 0 && (
                    <div
                      key={transaction.id}
                      className="w-full h-[116px] border-2 border-lightgray rounded-lg  flex flex-row justify-between items-center"
                    >
                      <div className="flex flex-row gap-4">
                        <div className="w-[100px] h-[100px] object-contain">
                          <Image
                            width={100}
                            height={100}
                            className="h-full w-auto"
                            src={"/bitcoinbandit.svg"}
                            alt="img"
                          />
                        </div>
                        <div className="flex flex-col h-full items-center justify-center">
                          <h1>{transaction?.raffle?.name}</h1>
                          {/* <h1>{transaction.Transaction.}</h1> */}
                          <p>NO12</p>
                        </div>
                      </div>
                      <div className="w- flex flex-row items-center justify-center text-left">
                        <h1> {groupedTransactions[transactionId].count}</h1>
                        <Image
                          src={"/ticket.svg"}
                          width={1}
                          height={1}
                          className="w-8 h-8"
                          alt="img"
                        />
                      </div>
                      <div className=" text-left items-end">
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
                      </div>
                    </div>
                  ),
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
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
