import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { clearToken } from "@/lib/auth";
import { useDispatch } from "react-redux";
import { setAddress, setConnected } from "@/slices/mainSlice";

export default function ProfileTabs() {
  //profile routing ends
  const router = useRouter();
  const dispatch = useDispatch();
  const slug = router.query.addr;

  //profile routing
  const Buttons = [
    {
      title: `My Inscriptions`,
      href: `/profile/${slug}/ins`,
    },
    {
      title: `My Created Raffles`,
      href: `/profile/${slug}/raf`,
    },
    {
      title: `My Tickets`,
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
    <div className="flex flex-col w-[280px] h-auto gap-8">
      <div className="flex flex-col w-full h-auto gap-[12px] p-[12px] border-lighterGray border rounded-xl">
        <div className="flex flex-row items-center justify-center p-[12px] border border-lightGray rounded-lg">
          <div className="w-[30%]">
            <Image
              src="/profile.svg"
              alt="Profile"
              width={72}
              height={72}
              className="mr-4 rounded-full w-18 h-18"
            />
          </div>

          <div className="w-[70%]">
            <p>wallet address</p>
          </div>
        </div>
        {/* <Button>My inscriptions</Button>
                        <Button>My Created Raffles</Button>
                        <Button>My Tickets</Button> */}
        {Buttons.map((button, index) => (
          <Button
            key={index}
            variant="primary"
            onClick={() => router.push(button.href)}
          >
            {button.title}
          </Button>
        ))}
      </div>
      <Button variant="primary" onClick={() => handleLogout()}>
        Log out
      </Button>
    </div>
  );
}
