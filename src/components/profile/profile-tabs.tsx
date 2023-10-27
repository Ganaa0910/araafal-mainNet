import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { clearToken } from "@/lib/auth";
import { useDispatch } from "react-redux";
import { setAddress, setConnected } from "@/slices/mainSlice";
import { Icons } from "../ui/icons";

export default function ProfileTabs() {
  //profile routing ends
  const router = useRouter();
  const dispatch = useDispatch();
  const slug = router.query.addr;

  //profile routing
  const Buttons = [
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
    dispatch(setAddress(""));
    dispatch(setConnected(false));
    window.localStorage.removeItem("userProfile");
    clearToken();
    router.push("/");
  };

  return (
    <div className="flex flex-col h-auto gap-8">
      <div className="flex flex-col w-full h-auto gap-[12px] p-[12px] border-lighterGray border-2 border-brand rounded-lg bg-gradient-to-r from-[#fc9446]/[0.5] to-[#fe6272]/[0.5]">
        <div className="flex flex-row items-center justify-center p-[12px] border-2 border-brand rounded-lg">
          <div className="w-[30%]">
            <div className="mr-4 rounded-full w-18 h-18 outline outline-1 outline-offset-4">
              <Image src="/profile.svg" alt="Profile" width={72} height={72} />
            </div>
          </div>

          <div className="w-[70%]">
            <p>Username</p>
            <p>wallet address</p>
          </div>
        </div>
        {/* <Button>My inscriptions</Button>
                        <Button>My Created Raffles</Button>
                        <Button>My Tickets</Button> */}
        {Buttons.map((button, index) => (
          <Button
            key={index}
            variant="secondary"
            onClick={() => router.push(button.href)}
          >
            {button.title}
          </Button>
        ))}
      </div>
      <Button variant="outline" onClick={() => handleLogout()}>
        <Icons.logout className="w-6 h-6 pr-3 transform rotate-180" />
        Log out
      </Button>
    </div>
  );
}
