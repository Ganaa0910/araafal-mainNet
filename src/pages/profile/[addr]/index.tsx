import { useState } from "react";

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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { ReduxAccount } from "@/lib/types";
export default function Profile() {
  //profile routing ends
  const router = useRouter();
  const queryClient = useQueryClient();
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const account = useSelector((state: ReduxAccount) => state.account);

  const slug = router.query.addr as string;
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["userProfile", slug],
    queryFn: () => getUserProfile(slug),
    enabled: !!slug && typeof slug === "string",
  });
  console.log("🚀 ~ file: index.tsx:37 ~ Profile ~ data:", data);

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

  const { data: refCode, isLoading: refCodeLoading } = useQuery({
    queryFn: () => getReferralCode(slug),
    queryKey: ["referralCode"],
    enabled: !!slug,
  });

  const { data: position } = useQuery({
    queryFn: () => getPosition(slug),
    queryKey: ["position"],
    enabled: !!slug,
  });

  const triggerReferral = async () => {
    await mutateAsync();
  };
  return (
    <Layout>
      <PageTitle name="Profile" />
      {/* <div className="py-[48px] md:py-[64px] px-4 md:px-[40px] w-full grid grid-cols-1 gap-8 justify-start items-center bg-red-600"> */}
      <div className="grid items-start justify-start w-full h-auto grid-cols-12 gap-8 ">
        <div className="col-span-3">
          <ProfileTabs account={account} />
        </div>
        <div className="flex flex-col col-span-6 gap-8">
          <div className="grid w-full grid-cols-2 gap-8">
            <Card
              title="Create raffle"
              points="2"
              description="Create raffle with your inscription"
              linkTo="/createRaffle"
              buttonText="Go"
            />
            <Card
              title="Buy ticket"
              points="1"
              description="Buy a ticket from others’ raffle"
              linkTo="/raffles"
              buttonText="Go"
            />
          </div>
          <div className="grid w-full grid-cols-2 gap-8">
            <Card
              title="Claim prize"
              points="1"
              description="Claim prize of your created raffle"
              linkTo="/aa"
              buttonText="Go"
            />
            <Card
              title="Win raffle"
              points="1"
              description="Win raffle of others'"
              linkTo="/aa"
              buttonText="Go"
            />
          </div>
          <div className="flex flex-col gap-5 p-6 border w-fulls rounded-xl border-brand bg-brandBlack">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <div className="text-xl font-bold">Invite 3 friends</div>
                <div className="text-lg font-bold">2 </div>
              </div>
              <div>20 pts</div>
            </div>
            <div className="flex justify-center w-full">
              {refCode !== null ? (
                <div className="flex w-full gap-6">
                  <input
                    type="text"
                    name="searchWallet"
                    className="h-12 pl-3 text-xl font-medium rounded-md hover:border-brand hover:border-2 grow bg-brandBlack focus:outline-none"
                    placeholder="Search"
                    readOnly
                    value={`https://www.araafal.com/register?referralCode=${refCode?.code}`}
                  />
                  <Button
                    variant={"primary"}
                    className="grow-0"
                    size={"lg"}
                    onClick={() => triggerReferral()}
                    disabled={referralLoading}
                  >
                    Copy
                  </Button>
                </div>
              ) : (
                <Button
                  variant={"primary"}
                  className="grow-0"
                  onClick={() => triggerReferral()}
                  disabled={referralLoading}
                >
                  {referralLoading && (
                    <Icons.spinner
                      className="w-4 h-4 mr-0 md:mr-2 animate-spin "
                      aria-hidden="true"
                    />
                  )}
                  Create link
                </Button>
              )}
            </div>
          </div>
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
