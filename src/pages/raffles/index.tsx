import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import { fetchRaffleById } from "@/lib/fetcherFunctions";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function Index() {
  return (
    <Layout>
      <PageTitle name="Raffles" />
      index
    </Layout>
  );
}
