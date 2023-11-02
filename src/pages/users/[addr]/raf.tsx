import { useRouter } from "next/router";

import CreatedRaffleCard from "@/components/atom/cards/created-raffle-card";
import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import PublicProfileTabs from "@/components/profile/public-profile-tabs";
import { getUserRaffles } from "@/lib/service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function Raf() {
  // const account = useSelector((state: ReduxAccount) => state.account);
  const router = useRouter();
  const slug = router.query.addr;

  const { data: raffles, isLoading } = useQuery({
    queryKey: ["raffleTitle", slug],
    queryFn: () => {
      if (typeof slug === "string") {
        return getUserRaffles(slug);
      }
    },
    enabled: !!slug,
  });

  return (
    <Layout>
      <PageTitle name="Profile" />
      <div className="grid h-auto grid-cols-12 gap-8 ">
        <div className="col-span-3">
          <PublicProfileTabs />
        </div>
        <div className="grid h-auto col-span-9 gap-5 px-6 pt-5 pb-6 overflow-auto border-2 rounded-lg lg:grid-cols-2 xl:grid-cols-3 border-brand bg-brandBlack">
          {!isLoading && raffles && raffles?.length > 0 ? (
            raffles.map((raffle) => (
              <div key={raffle.id}>
                <CreatedRaffleCard raffle={raffle} isPublic={true} />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center h-full col-span-3 gap-6 mt-5">
              <Image alt="smile" width={72} height={72} src={"/smile.svg"} />
              <h1 className="mb-2 text-2xl font-bold text-neutral100 ">
                haven&apos;t created any raffle
              </h1>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
