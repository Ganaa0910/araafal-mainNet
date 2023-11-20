import { Raffle } from "@/lib/types/dbTypes";
import Link from "next/link";
import Image from "next/image";

export default function ProfileBar({
  raffleDetail,
}: {
  raffleDetail: Raffle | undefined;
}) {
  const ownerId = raffleDetail?.ownerId;
  const shortAddress = ownerId
    ? `${ownerId.slice(0, 4)}...${ownerId.slice(-6)}`
    : "";

  return (
    <div className="flex flex-row  items-center border-2 rounded-xl border-brand raffle-gradient w-full h-[104px] py-5 px-6 gap-4">
      <h1 className="text-2xl font-bold ">Created by</h1>
      <div className="flex flex-row items-center gap-2 p-2 rounded-s-full rounded-e-lg bg-brandBlack ">
        {/* <p className="text-lg">Horny Micheal</p> */}
        <Link href={`/users/${ownerId}/raf`} className="flex gap-2">
          {raffleDetail && (
            <Image
              src={
                raffleDetail?.profileInscriptionLink
                  ? raffleDetail?.profileInscriptionLink
                  : "/images/profile.png"
              }
              height={49}
              width={49}
              className="rounded-full p-[1px] border border-white"
              alt="profile"
            />
          )}
          <div className="flex flex-col justify-center gap-[2px]">
            <div className="text-xl font-bold">
              {raffleDetail?.userName ? raffleDetail?.userName : shortAddress}
            </div>
            {raffleDetail?.userName && (
              <div className="text-lg ">{shortAddress}</div>
            )}
            {/* <p className="text-lg text-whiteish">{shortAddress}</p> */}
          </div>
        </Link>
      </div>
    </div>
  );
}
