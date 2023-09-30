import { Raffle } from "@/lib/types/dbTypes";

export default function InfoSection({
  raffleDetail,
}: {
  raffleDetail: Raffle | undefined;
}) {
  return (
    <div className="order-1 md:order-2 flex flex-col gap-6 col-span-2">
      <div>
        <h1 className="text-5xl text-orange-500 font-semibold mb-6">
          {raffleDetail?.name}
        </h1>{" "}
        <h2 className="text-3xl">How to participate</h2>
      </div>
      <div>
        <div className="flex flex-col gap-3">
          <p className="text-base text-justify">
            Win raffle by participating with BTC!!
          </p>

          <p className="text-base text-justify">
            Once the raffle ends, winner will automatically chosen
          </p>
        </div>
      </div>
    </div>
  );
}
