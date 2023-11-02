import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";

export default function PublicProfileTabs() {
  //profile routing ends

  const router = useRouter();
  const dispatch = useDispatch();
  const slug = router.query.addr;
  const isActive = (href: string) => router.asPath === href;

  // console.log("hello" + router.pathname);
  const shortAddress = `${slug?.slice(0, 4)}...${slug?.slice(-6)}`;

  //profile routing
  const Buttons = [
    // {
    //   title: `${shortAddress}`,
    //   href: `/users/${slug}/raf`,
    // },
    {
      title: `Created raffles`,
      href: `/users/${slug}/raf`,
    },
    {
      title: `Tickets`,
      href: `/users/${slug}/tic`,
    },
  ];

  return (
    <div className="flex flex-col h-auto gap-8">
      <div className="flex flex-col w-full h-auto gap-[12px] p-[12px] border-lighterGray border-2 border-brand rounded-lg bg-gradient-to-r from-[#fc9446]/[0.5] to-[#fe6272]/[0.5]">
        <div className="w-full h-auto border-2 border-brand p-2 text-center bg-brandBlack rounded-xl">
          {shortAddress}
        </div>
        {Buttons.map((button, index) => (
          <Button
            key={index}
            variant={isActive(button.href) ? "active" : "notActive"}
            onClick={() => router.push(button.href)}
          >
            {button.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
