import React from "react";
import Image from "next/image";
import Button from "../Button";
import { useRouter } from "next/router";

export default function ProfileTabs() {
  //profile routing ends
  const router = useRouter();
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
              className="w-18 h-18 rounded-full mr-4"
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
          <Button key={index} onClick={() => router.push(button.href)}>
            {button.title}
          </Button>
        ))}
      </div>
      <Button>Log out</Button>
    </div>
  );
}
