import { Raffle } from "@/lib/types/dbTypes";
import Image from "next/image";

export default function ProfileBar({
  raffleDetail,
}: {
  raffleDetail: Raffle | undefined;
}) {
  return (
    <div className="flex flex-row border rounded-xl border-white w-full h-[104px]">
      <h1>Created by</h1>
      <div className="flex flex-row  bg-brandBlack">
        {raffleDetail?.inscriptionPreviewUrl && (
          <Image
            src={raffleDetail?.inscriptionPreviewUrl}
            width={1}
            height={1}
            alt="owner"
            className="w-[42px] h-[42px] rounded-3xl"
          />
        )}
        <div className="flex flex-col rounded-xl">
          {raffleDetail?.owner?.walletAddress && (
            <p>{raffleDetail.owner.walletAddress}</p>
          )}
          {raffleDetail?.owner?.walletAddress && (
            <p>{raffleDetail.owner.walletAddress}</p>
          )}
        </div>
      </div>
    </div>
  );
}
