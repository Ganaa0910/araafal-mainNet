// import raffle from "../../raffleDetails.json";
import { Button } from "@/components/ui/button";
import { Raffle } from "@/lib/types/dbTypes";

export default function InscriptionDetails({
  raffleDetail,
}: {
  raffleDetail: Raffle | undefined;
}) {
  return (
    <div className="w-full border-2 rounded-xl border-primaryBrand raffle-gradient">
      <div className="flex flex-col w-full h-auto px-6 pb-6 pt-5">
        <div className="mb-3">
          <h1 className="text-2xl font-bold">Inscription detail</h1>
          {/* <p className="pt-6 text-base">{raffleDetail?.name}</p> */}
        </div>
        <div className="flex flex-col gap-3 text-base">
          <div className="flex justify-between">
            <h5>ID</h5>
            <a
              className="flex items-center gap-2 text-white hover:text-blue-400"
              href={`https://ordinals.com/inscription/${raffleDetail?.inscriptionId}`}
            >
              {raffleDetail?.inscriptionId?.substring(0, 8) +
                "..." +
                raffleDetail?.inscriptionId?.substring(
                  raffleDetail?.inscriptionId?.length - 2,
                )}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5 5.5L15.5 0.5M15.5 0.5H10.5M15.5 0.5L8.83333 7.16667M6.33333 2.16667H4.5C3.09987 2.16667 2.3998 2.16667 1.86502 2.43915C1.39462 2.67883 1.01217 3.06129 0.772484 3.53169C0.5 4.06647 0.5 4.76654 0.5 6.16667V11.5C0.5 12.9001 0.5 13.6002 0.772484 14.135C1.01217 14.6054 1.39462 14.9878 1.86502 15.2275C2.3998 15.5 3.09987 15.5 4.5 15.5H9.83333C11.2335 15.5 11.9335 15.5 12.4683 15.2275C12.9387 14.9878 13.3212 14.6054 13.5608 14.135C13.8333 13.6002 13.8333 12.9001 13.8333 11.5V9.66667"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
          <div className="flex flex-row justify-between">
            <h5>Number</h5>
            {/* <p>{raffleDetail?.id}</p> */}
            <p>14493587</p>
          </div>
          <Button variant={"primary2"} className="w-full mx-auto mb-0">
            View Inscriptions
          </Button>
          {/* <div className="flex justify-between px-6 py-4">
                <h5>Owner</h5>
                <p>0x...C544</p>
              </div> */}
          {/* <div className="flex justify-between ">
            <h5>Sat Rarity</h5>
            <p>{raffle.prize.rarity}</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
