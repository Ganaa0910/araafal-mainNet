import { Raffle } from "@/lib/types/dbTypes";

export default function InsDescription({
  raffleDetail,
}: {
  raffleDetail: Raffle | undefined;
}) {
  return (
    <div className="flex flex-col w-full gap-3 px-6 pt-5 pb-6 border-2 rounded-xl border-primaryBrand raffle-gradient">
      <h1 className="text-2xl font-bold">Description</h1>
      <div className="px-5 py-3 text-xl border-2 rounded-lg border-primaryBrand bg-brandBlack">
        This unique NFT features an exclusive rendition of Pepe, painstakingly
        crafted by a talented digital artist. With intricate details and vibrant
        colors, this Pepe is a true work of art that captures the essence of the
        meme.
      </div>
    </div>
  );
}
{
  /* <h1 className="mb-6 text-5xl font-semibold text-orange-500">
          {raffleDetail?.name}
        </h1>{" "} */
}
