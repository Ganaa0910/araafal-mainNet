import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import PublicProfileTabs from "@/components/profile/public-profile-tabs";
import { TransactionWithTicket, getTicketsByUser } from "@/lib/service";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import Countdown from "react-countdown";
// import { UseSelector } from "react-redux/es/hooks/useSelector";
import { utcToLocalTime } from "@/lib/helpers";
import TicketCard from "@/components/atom/cards/ticket-card";
enum TicketStatus {
  TICKET_ENDED,
  TICKET_RUNNING,
  TICKET_WON,
}
const Tic = () => {
  //profile routing ends
  const router = useRouter();

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

  return (
    <>
      <Layout>
        <PageTitle name="Profile" />
        <div className="grid h-auto grid-cols-12 gap-8 ">
          <div className="col-span-3">
            <PublicProfileTabs />
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
    </>
  );
};

export default Tic;
