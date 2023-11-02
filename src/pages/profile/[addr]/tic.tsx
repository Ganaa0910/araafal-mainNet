import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import ClaimPrize from "@/components/modal/claim-prize";
import ProfileTabs from "@/components/profile/profile-tabs";
import { Button } from "@/components/ui/button";
import { TransactionWithTicket, getTicketsByUser } from "@/lib/service";
import { ReduxAccount } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
enum TicketStatus {
  TICKET_ENDED,
  TICKET_RUNNING,
  TICKET_WON,
}

const Tic = () => {
  //profile routing ends
  const router = useRouter();

  const account = useSelector((state: ReduxAccount) => state.account);

  const [claimPrizeActive, setClaimPrizeActive] = useState(false);
  const [claimingTicket, setClaimingTicket] = useState<any>(null);

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

  const toggleClaimActive = () => {
    setClaimPrizeActive(!claimPrizeActive);
  };

  const handleClaimButtonClick = (ticket: TransactionWithTicket) => () => {
    setClaimingTicket(ticket);
    setClaimPrizeActive(
      (prevClaimActive: boolean): boolean => !prevClaimActive,
    );
  };

  return (
    <Layout>
      {claimPrizeActive && (
        <ClaimPrize
          show={claimPrizeActive}
          handleClose={toggleClaimActive}
          claimingTicket={claimingTicket}
        />
      )}
      <PageTitle name="Profile" />
      <div className="grid grid-cols-12 h-auto gap-8 ">
        <div className="col-span-3">
          <ProfileTabs account={account} />
        </div>

        <div className="col-span-9 min-h-[694px] flex flex-col border-2 border-brand rounded-xl px-6 pt-5 pb-6 gap-3 overflow-auto">
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
                const renderer = ({
                  hours,
                  minutes,
                  seconds,
                  completed,
                }: any) => {
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
                      <div className="w-[100px] h-[100px] shrink-0">
                        <Image
                          width={100}
                          height={100}
                          className="object-cover w-full h-full rounded-lg"
                          src={ticket?.inscriptionPreviewUrl}
                          alt="img"
                        />
                      </div>
                      <div className="flex flex-col items-center justify-center h-full">
                        <h3 className="text-xl">{ticket?.name}</h3>
                        {/* <h1>{transaction.Transaction.}</h1> */}
                      </div>
                    </div>
                    {/* ________________________________------------------------------------_____________________________________ */}
                    <div className="flex flex-row items-center justify-center gap-2">
                      <h1 className="text-2xl"> {ticket?.ticketCount}</h1>
                      <Image
                        src={"/images/ticketGrad.svg"}
                        width={1}
                        height={1}
                        className="w-8 h-8 "
                        alt="img"
                      />
                    </div>
                    {/* ________________________________------------------------------------_____________________________________ */}
                    <div className="text-end">
                      {isEnded ? (
                        ticket.winnerId == slug ? (
                          <Button
                            variant={"primary"}
                            onClick={handleClaimButtonClick(ticket)}
                          >
                            Claim{" "}
                          </Button>
                        ) : (
                          "Ended"
                        )
                      ) : (
                        <Countdown date={ticket.endDate} renderer={renderer} />
                      )}
                    </div>
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
        alt="Claim"
        src={"/claim.svg"}
        width={1}
        height={1}
        className="w-6 h-6"
      ></Image>
      Claim
    </button>
  );
};
