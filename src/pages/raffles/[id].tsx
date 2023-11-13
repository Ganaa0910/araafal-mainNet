import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import BuyPanel from "@/components/section/raffleDetail/ins-buy-panel";

import InsDescription from "@/components/section/raffleDetail/ins-description";
import InscriptionDetails from "@/components/section/raffleDetail/ins-details";
import Leaderboard from "@/components/section/raffleDetail/ins-leaderboard";
import ProfileBar from "@/components/section/raffleDetail/ins-profile";
import ViewInscription from "@/components/section/raffleDetail/ins-view";
import { fetchRaffleById, getTicketsByRaffle } from "@/lib/service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Detail() {
  const router = useRouter();
  const slug = router.query.id;
  const [tokens, setTokens] = useState([]);
  const {
    isLoading,
    isError,
    data: raffleDetail,
    error,
  } = useQuery({
    queryKey: ["raffleDetail", slug],
    queryFn: () => {
      if (typeof slug === "string") {
        return fetchRaffleById(slug);
      }
    },
    enabled: !!slug,
  });
  const { data: tickets } = useQuery({
    queryKey: ["tickets", slug],
    queryFn: () => {
      if (typeof slug === "string") {
        return getTicketsByRaffle(slug);
      }
    },
    enabled: !!slug,
  });
  console.log("🚀 ~ file: [id].tsx:42 ~ Detail ~ tickets:", tickets);

  return (
    <Layout>
      <div className="h-[850px] ">
        <PageTitle name="Raffle page" />

        <div className="grid grid-cols-12 gap-8 ">
          <div className="flex flex-col col-span-3 gap-8">
            {raffleDetail && <ViewInscription raffleDetail={raffleDetail} />}
            <InscriptionDetails raffleDetail={raffleDetail} />
          </div>

          <div className="flex flex-col col-span-5 gap-8">
            <BuyPanel raffleDetail={raffleDetail} tickets={tickets} />
            <InsDescription raffleDetail={raffleDetail} />
          </div>
          <div className="flex flex-col col-span-4 gap-8">
            <ProfileBar raffleDetail={raffleDetail} />
            <Leaderboard raffleDetail={raffleDetail} tickets={tickets} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
