import RaffleCard from "@/components/atom/cards/raffle-card";
import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import { fetchRaffleById, fetchRaffles } from "@/lib/fetcherFunctions";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function Index() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["raffles"],
    queryFn: fetchRaffles,
  });
  return (
    <Layout>
      <PageTitle name="Raffles" />
      <div className="grid grid-cols-4 gap-4">
        {data?.map((ins) => (
          <div key={ins.id}>
            <RaffleCard raffle={ins} />
          </div>
        ))}
      </div>
    </Layout>
  );
}
