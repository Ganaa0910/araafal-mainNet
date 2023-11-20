import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
// import MyInscriptions from '@/components/MyInscriptions'
import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import ProfileTabs from "@/components/profile/profile-tabs";
import { Icons } from "@/components/ui/icons";
import {
  createReferral,
  getPosition,
  getReferralCode,
  getUserProfile,
} from "@/lib/service";
import { ReduxAccount } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "sonner";
export default function Profile() {
  //profile routing ends
  const router = useRouter();
  const queryClient = useQueryClient();
  const account = useSelector((state: ReduxAccount) => state.account);
  const [userName, setUserName] = useState("");

  const slug = router.query.addr as string;
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["userProfile", slug],
    queryFn: () => getUserProfile(slug),
    enabled: !!slug && typeof slug === "string",
  });

  const {
    data: refData,
    isLoading: referralLoading,
    mutateAsync,
  } = useMutation({
    mutationFn: createReferral,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["referralCode"] });
      toast.success(`Successfully created`);
    },
  });

  const handleInputChange = (e: any) => {
    setUserName(e.target.value);
  };
  const saveUserName = async () => {};

  return (
    <Layout>
      <PageTitle name="Profile" />
      {/* <div className="py-[48px] md:py-[64px] px-4 md:px-[40px] w-full grid grid-cols-1 gap-8 justify-start items-center bg-red-600"> */}
      <div className="grid items-start justify-start w-full h-auto grid-cols-12 gap-8">
        <div className="col-span-3">
          <ProfileTabs account={account} />
        </div>
        <div className="flex flex-col col-span-6 gap-8 ">
          <div className="flex flex-col gap-4 p-6 border bg-brandBlack rounded-xl border-brand">
            <h1 className="text-2xl font-bolds">User name</h1>
            <div className="flex flex-row justify-between w-full gap-4">
              <input
                type="text"
                placeholder="Enter user name"
                value={userName}
                onChange={(e) => handleInputChange(e)}
                className="w-full px-6 py-3 rounded-lg bg-brandBlack focus:outline-none hover:border hover:border-brand"
              />
              <Button
                onClick={() => saveUserName()}
                variant={"secondary"}
                className="h-full"
              >
                Save
              </Button>
            </div>
          </div>
          <div className="p-6 border bg-brandBlack rounded-xl border-brand"></div>
        </div>
        <div className="flex flex-col col-span-3 gap-6 p-6 border bg-brandBlack rounded-xl border-brand">
          <div className="flex flex-col gap-4 ">
            <h1 className="text-2xl font-bolds">Avatar</h1>
            <div className="flex flex-col justify-center gap-4">
              <input
                type="text"
                placeholder="Enter user name"
                value={userName}
                onChange={(e) => handleInputChange(e)}
                className="w-full px-6 py-3 rounded-lg bg-brandBlack focus:outline-none hover:border hover:border-brand"
              />
              <Button
                onClick={() => saveUserName()}
                variant={"secondary"}
                className="h-full"
              >
                Change avatar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const Card = ({
  title,
  points,
  description,
  linkTo,
  buttonText,
}: {
  title: string;
  points: string;
  description: string;
  linkTo: string;
  buttonText: string;
}) => {
  return (
    <div className="flex flex-col justify-between w-full gap-5 p-6 border rounded-xl border-brand bg-brandBlack">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="text-xl font-bold">{title}</div>
          <div className="text-lg font-bold">{points}</div>
        </div>
        <div>{description}</div>
      </div>
      <Link href={linkTo} className="flex w-full">
        <Button variant={"primary"} className="w-full">
          {buttonText}
        </Button>
      </Link>
    </div>
  );
};
