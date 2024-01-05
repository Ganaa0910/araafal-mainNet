import { getUserProfile } from "@/lib/service";
import { useWalletStore } from "@/slices/walletStore";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
export default function ProfileHeader({
  username,
  walledAddress,
  points,
}: {
  username: string;
  walledAddress: string;
  points: Number;
}) {
  const router = useRouter();
  const shortAddress = `${walledAddress?.slice(0, 8)}...${walledAddress?.slice(
    -6,
  )}`;
  const { setConnectedAddress, setConnected } = useWalletStore();
  const slug = router.query.addr as string;
  const isActive = (href: string) => router.asPath === href;
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["userProfile", slug],
    queryFn: () => getUserProfile(slug),
    enabled: !!slug && typeof slug === "string",
  });
  return (
    <div className="flex flex-row gap-6 h-[160px] bg-neutral500 mb-8 p-6 rounded-xl relative">
      <div className="h-full w-auto">
        <Image
          src={
            data?.profileInscriptionLink
              ? data?.profileInscriptionLink
              : "/images/profile.png"
          }
          height={49}
          width={49}
          className="rounded-full p-[1px] border  w-[112px]"
          alt="profile"
        />
      </div>
      <div className="flex flex-col">
        <h1 className="text-profileTitle mb-3">{username}</h1>
        <p className="mb-6 text-lg flex items-center">
          {shortAddress}
          <button className=" text-xs font-semibold rounded-md ">
            <Image src="/copy.svg" alt="Copy" width={20} height={20} />
          </button>
        </p>
        <div className="flex flex-row">
          <div className="flex items-center">
            <h1>Points: 12 pts</h1>
          </div>
          <div className="border-r border-solid border-gray-700 h-full mx-4"></div>
          <div className="flex items-center">
            <h1>Position: 34</h1>
          </div>
        </div>
      </div>
      <div className="absolute  right-0 top-0  m-6">
        <button className=" text-xs font-semibold rounded-md  w-[48px] h-[48px]">
          <Image
            src="/edit.svg"
            alt="Copy"
            width={48}
            height={48}
            className="mx-auto my-auto border-none"
          />
        </button>
      </div>
    </div>
  );
}
