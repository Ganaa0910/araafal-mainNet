import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
// import MyInscriptions from '@/components/MyInscriptions'
import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import ChooseInscription from "@/components/modal/choose-inscription";
import ProfileTabs from "@/components/profile/profile-tabs";
import { Icons } from "@/components/ui/icons";
import { getInscriptionsTestnet, getUserProfile } from "@/lib/service";
import { profileUpdateHandler } from "@/lib/service/postRequest";
import { InscriptionType, ReduxAccount } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "sonner";
export default function Profile() {
  //profile routing ends
  const router = useRouter();
  const queryClient = useQueryClient();
  const account = useSelector((state: ReduxAccount) => state.account);
  const [userName, setUserName] = useState("");
  const [twitterUserName, setTwitterUserName] = useState("");
  const [discordUserName, setDiscordUserName] = useState("");
  const [showTwitterInput, setShowTwitterInput] = useState(false);
  const [showDiscordInput, setShowDiscordInput] = useState(false);
  const [showInscriptions, setShowInscriptions] = useState(false);
  const [chosenInscription, setChosenInscription] =
    useState<InscriptionType | null>(null);

  const slug = router.query.addr as string;

  const { data: inscriptions } = useQuery({
    queryKey: ["inscriptions", account],
    queryFn: () => {
      return getInscriptionsTestnet(account.address);
    },
    enabled: account.connected == true,
  });
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["userProfile", slug],
    queryFn: () => getUserProfile(slug),
    enabled: !!slug && typeof slug === "string",
  });
  useEffect(() => {
    if (data) {
      if (data.userName) {
        setUserName(data.userName);
      }
      if (data.twitterHandle) {
        setTwitterUserName(data.twitterHandle);
        setShowTwitterInput(true);
      }
      if (data.discordHandle) {
        setDiscordUserName(data.discordHandle);
        setShowDiscordInput(true);
      }
    }
  }, [data]);
  useEffect(() => {
    if (typeof slug === "string") {
      if (
        (slug && account.address && slug !== account.address) ||
        !account.connected
      ) {
        router.replace(`/users/${slug}/raf`);
      }
    }
  }, [slug, account.address, account.connected]);
  const {
    data: updatedData,
    isLoading: referralLoading,
    mutateAsync,
  } = useMutation({
    mutationFn: profileUpdateHandler,
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", slug] });
    },
  });

  const handleInputChange = (e: any) => {
    setUserName(e.target.value);
  };

  const toggleSaveTwitter = () => {
    setShowTwitterInput(true);
  };
  const triggerSaveDiscord = () => {
    setShowDiscordInput(true);
  };

  const saveUserName = async () => {
    if (userName == "") {
      return toast.error("Please fill user name");
    }
    await mutateAsync({
      userData: {
        userName,
      },
    });
  };

  const saveTwitterHandle = async () => {
    if (twitterUserName == "") {
      return toast.error("Please fill twitter name");
    }
    const data = await mutateAsync({
      userData: {
        twitterHandle: twitterUserName,
      },
    });
    if (data.error) {
      return toast.error(data.error);
    } else {
      toast.success(`Successfully updated`);
      // setShowTwitterInput(false);
    }
  };

  const saveDiscordHandle = async () => {
    if (discordUserName == "") {
      return toast.error("Please fill discord name");
    }
    const data = await mutateAsync({
      userData: {
        discordHandle: discordUserName,
      },
    });
    if (data.error) {
      return toast.error(data.error);
    } else {
      toast.success(`Successfully updated`);
      // setShowTwitterInput(false);
    }
  };
  const toggleInscriptions = () => {
    if (account.connected !== true) {
      return toast.error("Please connect your wallet");
    }
    setShowInscriptions(!showInscriptions);
  };

  const openInscriptions = () => {
    setShowInscriptions(!showInscriptions);
  };

  const saveProfileInscriptions = async () => {
    if (!chosenInscription) {
      return toast.error("Please choose inscription");
    }
    const insLink = `https://testnet.ordinals.com/content/${chosenInscription.inscriptionId}`;
    const data = await mutateAsync({
      userData: {
        profileInscriptionLink: insLink,
      },
    });
    if (data.error) {
      return toast.error(data.error);
    } else {
      toast.success(`Successfully updated`);
      setChosenInscription(null);
      // setShowTwitterInput(false);
    }
  };

  return (
    <Layout>
      <ChooseInscription
        show={showInscriptions}
        handleClose={toggleInscriptions}
        inscriptions={inscriptions}
        setChosenInscription={setChosenInscription}
      />
      <PageTitle name="Profile" />
      {/* <div className="py-[48px] md:py-[64px] px-4 md:px-[40px] w-full grid grid-cols-1 gap-8 justify-start items-center bg-red-600"> */}
      <div className="grid items-start justify-start w-full h-auto grid-cols-12 gap-8">
        <div className="col-span-3">
          <ProfileTabs account={account} />
        </div>
        <div className="flex flex-col col-span-5 gap-8 ">
          <div className="flex flex-col gap-4 p-6 border bg-brandBlack rounded-xl border-brand">
            <h1 className="text-2xl font-bold">User name</h1>
            <div className="flex flex-row justify-between w-full gap-4">
              <input
                type="text"
                placeholder="Enter user name"
                value={userName}
                onChange={(e) => handleInputChange(e)}
                className="w-full px-6 py-3 text-xl rounded-lg bg-brandBlack focus:outline-none hover:border hover:border-brand"
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
          <div className="flex flex-col gap-4 p-6 border bg-brandBlack rounded-xl border-brand">
            <h1 className="text-2xl font-bold">Social connections</h1>
            {showTwitterInput ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xl">
                  <div className="w-[80px] font-bold">X</div>
                  <input
                    type="text"
                    placeholder="handle"
                    value={twitterUserName}
                    onChange={(e) => setTwitterUserName(e.target.value)}
                    className="px-6 py-3 text-xl rounded-lg bg-brandBlack focus:outline-none hover:border hover:border-brand"
                  />
                </div>
                <Button
                  onClick={() => saveTwitterHandle()}
                  variant={"secondary"}
                  className="h-full"
                >
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex gap-3 text-2xl font-bold">
                  <Icons.twitter className="h-9 w-9" />
                  Twitter
                </div>
                <Button
                  onClick={() => toggleSaveTwitter()}
                  variant={"secondary"}
                  className="h-full"
                >
                  Connect
                </Button>
              </div>
            )}

            {showDiscordInput ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xl">
                  <div className="w-[80px] font-bold">Discord</div>

                  <input
                    type="text"
                    placeholder="handle"
                    value={discordUserName}
                    onChange={(e) => setDiscordUserName(e.target.value)}
                    className="px-6 py-3 text-xl rounded-lg bg-brandBlack focus:outline-none hover:border hover:border-brand"
                  />
                </div>
                <Button
                  onClick={() => saveDiscordHandle()}
                  variant={"secondary"}
                  className="h-full"
                >
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex gap-3 text-2xl font-bold">
                  <Icons.discord className="h-9 w-9" />
                  Discord
                </div>
                <Button
                  onClick={() => triggerSaveDiscord()}
                  variant={"secondary"}
                  className="h-full"
                >
                  Connect
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col col-span-4 gap-6 p-6 border bg-brandBlack rounded-xl border-brand">
          <div className="flex flex-col gap-7 ">
            <h1 className="text-2xl font-bold">Avatar</h1>
            <div className="flex flex-col items-center justify-center gap-7">
              <Image
                src={
                  data?.profileInscriptionLink
                    ? data?.profileInscriptionLink
                    : chosenInscription
                    ? `https://testnet.ordinals.com/content/${chosenInscription.inscriptionId}`
                    : "/images/profile.png"
                }
                height={192}
                width={192}
                className="rounded-full "
                alt="profile"
              />
              {chosenInscription ? (
                <Button
                  onClick={() => saveProfileInscriptions()}
                  variant={"secondary"}
                  className="w-[192px]"
                >
                  Confirm
                </Button>
              ) : (
                <Button
                  onClick={() => openInscriptions()}
                  variant={"secondary"}
                  className="w-[192px]"
                >
                  Change avatar
                </Button>
              )}
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
