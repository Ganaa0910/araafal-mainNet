import { clearToken } from "@/lib/auth";
import { Account } from "@/lib/types";
// import { setAddress, setConnected } from "@/slices/mainSlice";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
import { getUserProfile } from "@/lib/service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useWalletState } from "@/slices/store";

export default function ProfileTabs({
  connectedAddress,
}: {
  connectedAddress: string;
}) {
  //profile routing ends

  const router = useRouter();

  const { setConnectedAddress, setConnected } = useWalletState();
  const slug = router.query.addr as string;
  const isActive = (href: string) => router.asPath === href;

  // console.log("hello" + router.pathname);
  const shortAddress = `${connectedAddress?.slice(
    0,
    4,
  )}...${connectedAddress?.slice(-6)}`;

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["userProfile", slug],
    queryFn: () => getUserProfile(slug),
    enabled: !!slug && typeof slug === "string",
  });

  //profile routing
  const Buttons = [
    // {
    //   title: `${shortAddress}`,
    //   href: `/profile/${slug}`,
    // },
    {
      title: `Contest`,
      href: `/profile/${slug}/con`,
    },
    {
      title: `Inscriptions`,
      href: `/profile/${slug}/ins`,
    },
    {
      title: `My created Raffles`,
      href: `/profile/${slug}/raf`,
    },
    {
      title: `My tickets`,
      href: `/profile/${slug}/tic`,
    },
  ];
  const handleLogout = () => {
    setConnectedAddress("");
    setConnected(false);
    window.localStorage.removeItem("userProfile");
    clearToken();
    router.push("/");
  };

  return (
    <div className="flex flex-col h-auto gap-8">
      <div className="flex flex-col w-full h-auto gap-[12px] p-[12px] border-lighterGray border-2 border-brand rounded-lg bg-gradient-to-r from-[#fc9446]/[0.5] to-[#fe6272]/[0.5]">
        <Button
          variant={isActive(`/profile/${slug}`) ? "active" : "notActive"}
          onClick={() => router.push(`/profile/${slug}`)}
          className="justify-start h-full px-4 py-4"
        >
          <div className="flex gap-3">
            <div>
              <Image
                src={
                  data?.profileInscriptionLink
                    ? data?.profileInscriptionLink
                    : "/images/profile.png"
                }
                height={49}
                width={49}
                className="rounded-full p-[1px] border border-white"
                alt="profile"
              />
            </div>
            <div className="flex flex-col justify-center gap-1 text-start">
              <div className="text-xl font-bold">
                {data?.userName ? data?.userName : shortAddress}
              </div>
              {data?.userName && <div className="text-lg ">{shortAddress}</div>}
            </div>
          </div>
        </Button>
        {Buttons.map((button, index) => (
          <Button
            key={index}
            variant={isActive(button.href) ? "active" : "notActive"}
            onClick={() => router.push(button.href)}
            className="text-lg font-bold h-13"
          >
            {button.title}
          </Button>
        ))}
      </div>
      <Button className="" variant="plain" onClick={() => handleLogout()}>
        {/* <Icons.logout className="w-6 h-6 pr-3 transform rotate-180" /> */}
        Log out
      </Button>
    </div>
  );
}
