import TicketCard from "@/components/atom/cards/ticket-card";
import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import ClaimPrize from "@/components/modal/claim-prize";
import ProfileTabs from "@/components/profile/profile-tabs";
import { TransactionWithTicket, getTicketsByUser } from "@/lib/service";
import { ReduxAccount } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

  const toggleClaimActive = () => {
    setClaimPrizeActive(!claimPrizeActive);
  };

  const handleClaimButtonClick = (ticket: TransactionWithTicket) => () => {
    setClaimingTicket(ticket.nftPrivateKey);
    setClaimPrizeActive(
      (prevClaimActive: boolean): boolean => !prevClaimActive,
    );
  };
  useEffect(() => {
    if (typeof slug === "string") {
      if (
        (slug && account.address && slug !== account.address) ||
        !account.connected
      ) {
        router.replace(`/users/${slug}/raf`);
      }
    }
  }, [slug, account.address, account.connected]);
  return (
    <Layout>
      <ClaimPrize
        show={claimPrizeActive}
        handleClose={toggleClaimActive}
        privateKey={claimingTicket}
        action="NFT"
      />
      <PageTitle name="Profile" />
      <div className="grid h-auto grid-cols-12 gap-8 ">
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
            tickets?.rows?.map((ticket: TransactionWithTicket) => (
              <TicketCard key={ticket.raffleId} ticket={ticket} />
            ))}
        </div>
      </div>
    </Layout>
  );
};
export default Tic;
