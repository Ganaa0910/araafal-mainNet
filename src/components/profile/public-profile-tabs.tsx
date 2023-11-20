import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/service";
import { Icons } from "../ui/icons";

export default function PublicProfileTabs() {
  //profile routing ends

  const router = useRouter();
  const dispatch = useDispatch();
  const slug = router.query.addr as string;
  const isActive = (href: string) => router.asPath === href;

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["userProfile", slug],
    queryFn: () => getUserProfile(slug),
    enabled: !!slug && typeof slug === "string",
  });

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
      <div className="flex flex-col w-full h-auto gap-3 p-[12px] border-lighterGray border-2 border-brand rounded-lg bg-gradient-to-r from-[#fc9446]/[0.5] to-[#fe6272]/[0.5]">
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
      <div className="flex flex-col w-full h-auto gap-3 p-[12px] border-lighterGray border-2 border-brand rounded-lg bg-gradient-to-r from-[#fc9446]/[0.5] to-[#fe6272]/[0.5]">
        <h1 className="text-xl font-bold">Social media</h1>
        <div className="flex flex-col gap-3">
          <Button
            // key={index}
            variant={"notActive"}
            className="flex justify-start gap-3 text-lg font-bold h-13"
            // onClick={() => router.push(button.href)}
          >
            <Icons.discord className="h-7 w-7" />
            {data?.twitterHandle}
          </Button>
          <Button
            // key={index}
            variant={"notActive"}
            className="flex justify-start gap-3 text-lg font-bold h-13"
          >
            <Icons.twitter className="h-7 w-7" />
            {data?.discordHandle}
          </Button>
        </div>
      </div>
    </div>
  );
}
