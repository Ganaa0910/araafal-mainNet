import { clearToken } from "@/lib/auth";
import { Account } from "@/lib/types/dbTypes";
import { setAddress, setConnected } from "@/slices/mainSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";

export default function ProfileTabs({ account }: { account: Account }) {
  //profile routing ends

  const router = useRouter();
  const dispatch = useDispatch();
  const slug = router.query.addr;
  const isActive = (href: string) => router.asPath === href;

  // console.log("hello" + router.pathname);
  const shortAddress = `${account?.address.slice(
    0,
    4,
  )}...${account?.address.slice(-6)}`;
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
        <div className="flex flex-row items-center justify-center p-[12px] border-2 border-brand rounded-lg w-[252px]">
          <Link href={`/profile/${slug}`}>
            <p>{shortAddress}</p>
          </Link>
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
      <Button variant="plain" onClick={() => handleLogout()}>
        <Icons.logout className="w-6 h-6 pr-3 transform rotate-180" />
        Log out
      </Button>
    </div>
  );
}
