import { Raffle } from "@/lib/types/dbTypes";
import Image from "next/image";

export default function ProfileBar({
  raffleDetail,
}: {
  raffleDetail: Raffle | undefined;
}) {
  // return (
  // <div className="flex flex-row border rounded-xl border-white w-full h-[104px]">
  //   <h1 className="">Created by</h1>
  //   <div className="flex flex-row  bg-brandBlack">
  //     {raffleDetail?.inscriptionPreviewUrl && (
  //       <Image
  //         src={raffleDetail?.inscriptionPreviewUrl}
  //         width={1}
  //         height={1}
  //         alt="owner"
  //         className="w-[42px] h-[42px] rounded-3xl"
  //       />
  //     )}
  //     <div className="flex flex-col rounded-xl">
  //       {raffleDetail?.owner?.walletAddress && (
  //         <p>{raffleDetail.owner.walletAddress}</p>

  //       )}

  //       {raffleDetail?.owner?.walletAddress && (
  //         <p>{raffleDetail.owner.walletAddress}</p>

  //       )}
  //       <p>Horny Micheal</p>
  //       <p>qWeR...4GFe23</p>
  //     </div>
  //   </div>
  // </div>

  // );
  return (
    <div className="flex flex-row  items-center border-2 rounded-xl border-primaryBrand raffle-gradient w-full h-[104px] py-5 px-6 gap-4">
      <h1 className=" text-2xl font-bold">Created by</h1>
      <div className="flex flex-row  bg-brandBlack items-center gap-2 p-2 rounded-tl-[32px] rounded-bl-[32px] rounded-tr-[8px] rounded-br-[8px] ">
        {raffleDetail?.inscriptionPreviewUrl && (
          <Image
            src={raffleDetail?.inscriptionPreviewUrl}
            width={42}
            height={42}
            alt="owner"
            className="w-[42px] h-[42px] rounded-3xl border-2 border-white"
          />
        )}
        <div className="flex flex-col rounded-xl">
          <p className="text-lg">Horny Micheal</p>
          <p className="text-sm text-whiteish">qWeR...4GFe23</p>
        </div>
      </div>
    </div>
  );
}
