import { Raffle } from "@/lib/types/dbTypes";
import Link from "next/link";
export default function ProfileBar({
  raffleDetail,
}: {
  raffleDetail: Raffle | undefined;
}) {
  const ownerId = raffleDetail?.ownerId;
  const shortenedOwnerId = ownerId
    ? `${ownerId.slice(0, 4)}...${ownerId.slice(-6)}`
    : "";

  return (
    <div className="flex flex-row  items-center border-2 rounded-xl border-brand raffle-gradient w-full h-[104px] py-5 px-6 gap-4">
      <h1 className="text-2xl font-bold ">Created by</h1>
      <div className="flex flex-row items-center gap-2 px-8 py-4 bg-brandBlack rounded-xl ">
        <div className="flex flex-col rounded-xl">
          {/* <p className="text-lg">Horny Micheal</p> */}
          <Link href={`/users/${ownerId}/raf`}>
            <p className="text-lg text-whiteish">{shortenedOwnerId}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
