import { useRouter } from "next/router";

import CreatedRaffleCard from "@/components/atom/cards/created-raffle-card";
import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import ClaimPrize from "@/components/modal/claim-prize";
import ProfileTabs from "@/components/profile/profile-tabs";
import { Button } from "@/components/ui/button";
import { getUserRaffles } from "@/lib/service";
import { ReduxAccount } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import RaffleSkeleton from "@/components/atom/cards/raffle-skeleton";

export default function Raf() {
  const account = useSelector((state: ReduxAccount) => state.account);
  const router = useRouter();
  const slug = router.query.addr;

  const [claimPrizeActive, setClaimPrizeActive] = useState(false);

  const [claimingTicket, setClaimingTicket] = useState<any>(null);
  const toggleClaimActive = () => {
    setClaimPrizeActive(!claimPrizeActive);
  };
  const { data: raffles, isLoading } = useQuery({
    queryKey: ["my raffles", slug],
    queryFn: () => {
      if (typeof slug === "string") {
        return getUserRaffles(slug);
      }
    },
    enabled: !!slug,
  });

  return (
    <Layout>
      <ClaimPrize
        show={claimPrizeActive}
        handleClose={toggleClaimActive}
        privateKey={claimingTicket}
        action="TICKET"
      />
      <PageTitle name="Profile" />
      <div className="grid h-auto grid-cols-12 gap-8 ">
        <div className="col-span-3">
          <ProfileTabs account={account} />
        </div>
        <div className="grid h-auto col-span-9 gap-5 px-6 pt-5 pb-6 overflow-auto border-2 rounded-lg lg:grid-cols-2 xl:grid-cols-3 border-brand bg-brandBlack">
          {isLoading ? (
            <>
              <RaffleSkeleton />
              <RaffleSkeleton />
              <RaffleSkeleton />
            </>
          ) : raffles && raffles?.length > 0 ? (
            raffles.map((raffle) => (
              <div key={raffle.id}>
                <CreatedRaffleCard
                  raffle={raffle}
                  onClaimButtonClick={toggleClaimActive}
                  setClaimingTicket={setClaimingTicket}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center h-full col-span-3 gap-6 mt-5">
              <Image alt="smile" width={72} height={72} src={"/smile.svg"} />
              <h1 className="mb-2 text-2xl font-bold text-neutral100 ">
                Haven&apos;t created any raffle bro.
              </h1>
              <div className="w-[280px]">
                <Button variant={"primary"} className="w-full">
                  <Link href={"/createraffle"}>Create raffle</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
