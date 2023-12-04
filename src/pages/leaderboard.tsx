import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import { Icons } from "@/components/ui/icons";
import { getLeaderboard, getPosition, getUserProfile } from "@/lib/service";
import { ReduxAccount } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Image from "next/image";
import { useWalletStore } from "@/slices/store";

export default function Leaderboard() {
  const { isConnected, connectedAddress } = useWalletStore();
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile(connectedAddress),
    enabled: isConnected == true,
  });

  const { isLoading: leaderLoading, data: leaderData } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => getLeaderboard(),
  });

  const { data: position } = useQuery({
    queryFn: () => getPosition(connectedAddress),
    queryKey: ["position"],
    enabled: !!data,
  });

  return (
    <Layout>
      <PageTitle name="Leaderboard" />
      <div className="grid grid-cols-12 gap-8">
        <div className="flex flex-col col-span-9 border-2 bg-brandBlack rounded-xl border-brand">
          <div className="flex items-center gap-6 px-6 py-2">
            <div className="text-2xl">#</div>
            <div className="flex justify-between w-full text-xl">
              <div>User</div>
              <div>Points</div>
            </div>
          </div>
          {!leaderLoading &&
            leaderData &&
            leaderData.length !== 0 &&
            leaderData?.map((lead, index) => (
              <div
                key={lead.walletAddress}
                className="flex items-center gap-6 px-6 py-2 border-t border-brand/40"
              >
                <div className="text-2xl w-[10px]">{index + 1}</div>
                <div className="flex justify-between w-full text-xl">
                  <div className="flex gap-4">
                    <Image
                      src={
                        lead?.profileInscriptionLink
                          ? lead?.profileInscriptionLink
                          : "/images/profile.png"
                      }
                      height={42}
                      width={42}
                      className="rounded-full p-[1px] border border-white"
                      alt="profile"
                    />
                    <div>
                      {lead?.walletAddress.slice(0, 4)}...
                      {lead?.walletAddress.slice(-6)}
                    </div>
                  </div>
                  <div>{lead.contestPoint}</div>
                </div>
              </div>
            ))}
        </div>
        <div className="flex flex-col col-span-3 gap-6 p-6 border bg-brandBlack rounded-xl border-brand">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="text-xl font-bold">My position</div>
              <Icons.ladder className="w-6 h-6" />
            </div>
            <div className="text-4xl font-bold">
              #{position?.currentPosition}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            My points
            <div className="text-4xl font-bold">{data?.contestPoint} pts</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
