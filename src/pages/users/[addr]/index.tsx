import { useRouter } from "next/router";
import { useState } from "react";

// import MyInscriptions from '@/components/MyInscriptions'
import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import PublicProfileTabs from "@/components/profile/public-profile-tabs";
import { getUserProfile } from "@/lib/service";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Profile() {
  //profile routing ends
  const router = useRouter();
  const queryClient = useQueryClient();
  const [inscriptions, setInscriptions] = useState([]);
  const [copied, setCopied] = useState(false);

  const slug = router.query.addr as string;
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["userProfile", slug],
    queryFn: () => getUserProfile(slug),
    enabled: !!slug && typeof slug === "string",
  });

  return (
    <Layout>
      <PageTitle name="Profile" />
      {/* <div className="py-[48px] md:py-[64px] px-4 md:px-[40px] w-full grid grid-cols-1 gap-8 justify-start items-center bg-red-600"> */}
      <div className="grid items-start justify-start w-full h-auto grid-cols-12 gap-8">
        <div className="col-span-3">
          <PublicProfileTabs />
        </div>
        <div className="flex flex-col col-span-9 gap-8"></div>
      </div>
    </Layout>
  );
}
