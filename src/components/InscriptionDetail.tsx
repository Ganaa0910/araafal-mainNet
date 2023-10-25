import { Raffle } from "@/lib/types/dbTypes";

export default function InscriptionDetail({
  raffleDetail,
}: {
  raffleDetail: Raffle | undefined;
}) {
  return (
    <div className="flex flex-col gap-3 border-2 rounded-xl border-primaryBrand w-full pt-5 px-6 pb-6 raffle-gradient">
      <h1 className="text-2xl font-bold">Description</h1>
      <div className="border-2 border-primaryBrand rounded-lg py-3 px-5 text-xl">
        This unique NFT features an exclusive rendition of Pepe, painstakingly
        crafted by a talented digital artist. With intricate details and vibrant
        colors, this Pepe is a true work of art that captures the essence of the
        meme.
      </div>
    </div>
  );
}
{
  /* <h1 className="text-5xl text-orange-500 font-semibold mb-6">
          {raffleDetail?.name}
        </h1>{" "} */
}
