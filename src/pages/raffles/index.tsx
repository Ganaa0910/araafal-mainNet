import RaffleCard from "@/components/atom/cards/raffle-card";
import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import {
  fetchFeaturedRaffles,
  fetchRaffleById,
  fetchRaffles,
} from "@/lib/service";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function Index() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["raffles"],
    queryFn: fetchRaffles,
  });

  console.log("🚀 ~ file: index.tsx:17 ~ Index ~ data:", data);

  const { isLoading: featuredLoading, data: featuredRaffles } = useQuery({
    queryKey: ["featuredRaffles"],
    queryFn: fetchFeaturedRaffles,
  });
  console.log(
    "🚀 ~ file: index.tsx:13 ~ Index ~ featuredRaffles:",
    featuredRaffles,
  );

  return (
    <Layout>
      <PageTitle name="Raffles" />
      <div className="grid grid-cols-4 gap-4">
        {!featuredLoading &&
          featuredRaffles &&
          featuredRaffles.length !== 0 &&
          featuredRaffles.map((ins) => (
            <div key={ins.id}>
              <RaffleCard raffle={ins} featured />
            </div>
          ))}
        {!isLoading &&
          data &&
          data.length != 0 &&
          data?.map((ins) => (
            <div key={ins.id}>
              <RaffleCard raffle={ins} featured={false} />
            </div>
          ))}
      </div>
    </Layout>
  );
}
