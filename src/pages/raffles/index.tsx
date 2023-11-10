import RaffleCard from "@/components/atom/cards/raffle-card";
import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import { fetchRaffles } from "@/lib/service";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React from "react";
import { useInView } from "react-intersection-observer";
import { Icons } from "@/components/ui/icons";

export default function Index() {
  // const { isLoading, isError, data, error } = useQuery({
  //   queryKey: ["raffles"],
  //   queryFn: fetchRaffles,
  // });
  const limit = 2;

  const { ref, inView } = useInView();

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(["raffles", 1, 6], fetchRaffles, {
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has less than the limit number of items, there are no more pages.
      if (lastPage.raffles.length < limit) {
        return undefined;
      }

      // Otherwise, return the next page number.
      return lastPage.nextPage;
    },
  });
  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <Layout>
      <PageTitle name="Raffles" />
      <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {data?.pages.map((page) => (
          <React.Fragment key={page.nextPage}>
            {page.raffles.map((project) => (
              <div key={project.id}>
                <RaffleCard raffle={project} featured={project.featured} />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-center w-full pt-16">
        <button
          ref={ref}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load Newer"
            : "Nothing more to load"}
        </button>
      </div>
    </Layout>
  );
}
