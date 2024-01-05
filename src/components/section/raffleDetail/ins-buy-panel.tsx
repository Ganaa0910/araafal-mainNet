import TicketConfirmation from "@/components/modal/ticket-confirmation";
import { Button } from "@/components/ui/button";
import { TicketsByRaffle } from "@/lib/types";
import { Raffle, Ticket } from "@/lib/types/dbTypes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getTokenImagePath } from "@/lib/helpers";
import { toast } from "sonner";
import { useWalletStore } from "@/slices/walletStore";
import { useTicketStore } from "@/slices/ticketStore";

export default function BuyPanel({
  raffleDetail,
  tickets,
}: {
  raffleDetail: Raffle | undefined;
  tickets: { rows: TicketsByRaffle[] };
}) {
  const { isConnected, connectedAddress } = useWalletStore();
  const { ticketAmount, setTicketAmount } = useTicketStore();

  const [isPurchaseOverlayOpen, setIsPurchaseOverlayOpen] = useState(false);

  const handleInputChange = (e: any) => {
    const newAmount = parseInt(e.target.value, 10);
    setTicketAmount(newAmount);
  };

  const handleIncrement = () => {
    if (raffleDetail && raffleDetail.sellingTicketLimit) {
      const newAmount = Math.min(
        ticketAmount + 1,
        raffleDetail.sellingTicketLimit,
      );
      setTicketAmount(newAmount);
    } else {
      return;
    }
  };

  const handleDecrement = () => {
    const newAmount = Math.max(ticketAmount - 1, 1);
    setTicketAmount(newAmount);
  };

  const handleOpenPurchaseOverlay = () => {
    if (isConnected !== true) {
      return toast.error("Please connect your wallet");
    }
    setIsPurchaseOverlayOpen(true);
  };

  const handleClosePurchaseOverlay = () => {
    setIsPurchaseOverlayOpen(false);
  };

  const returnTotalCount = () => {
    let totalCount = 0;
    for (let i = 0; i < tickets?.rows.length; i++) {
      totalCount += parseInt(tickets?.rows[i].ticketCount);
    }
    return totalCount;
  };

  const renderBuyPanel = () => (
    <>
      {raffleDetail && (
        <TicketConfirmation
          show={isPurchaseOverlayOpen}
          handleClose={handleClosePurchaseOverlay}
          newRaffleData={raffleDetail}
        />
      )}
      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className="w-1/2 pb-6">
            <p className="pb-2 text-base font-light text-lighterGray">Price per ticket</p>
            <h2 className="flex flex-row text-xl font-light">
              {raffleDetail && (
                <Image
                  src={getTokenImagePath(raffleDetail.sellingTokenTicker)}
                  alt="bitcoin"
                  width={24}
                  height={24}
                  className="mr-2"
                />
              )}
              {raffleDetail?.price} {raffleDetail?.sellingTokenTicker}
            </h2>
          </div>
          <div className="w-1/2 pb-6">
            <p className="pb-2 text-base font-light">Tickets purchased</p>
            <h2 className="flex flex-row text-xl font-light">
              <Image
                alt="ticket"
                src={"/ticket.svg"}
                width={24}
                height={24}
                className="mr-2"
              />
              {returnTotalCount()}
            </h2>
          </div>
        </div>
        <div className="flex flex-row w-full " role="group">
          <div className="flex flex-col w-1/2">
            <p className="pb-2 text-base font-light">Select amount</p>
            <div className="items-center text-lg font-extralight rounded-lg bg-brandBlack w-[10vw] px-1">
              <div className="flex justify-between md:px-0">
                <button
                  className="px-2 text-3xl text-white border-none rounded-r-none select-none bg-inherit"
                  onClick={handleDecrement}
                >
                  -
                </button>
                <input
                  className="w-20 text-xl text-center focus:border-none bg-inherit focus:outline-none"
                  type="text"
                  min="1"
                  readOnly
                  max="1000"
                  value={ticketAmount.toFixed(1)}
                  placeholder="1"
                  onChange={(e) => handleInputChange(e)}
                />
                <button
                  className="px-2 text-3xl text-white border-none rounded-l-none rounded-r select-none bg-inherit"
                  onClick={handleIncrement}
                  disabled={ticketAmount == 10}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="items-start">
              <p className="pb-2 text-base font-light">Total cost</p>
              {raffleDetail && (
                <h2 className="flex flex-row text-xl font-light">
                  {raffleDetail && (
                    <Image
                      src={getTokenImagePath(raffleDetail.sellingTokenTicker)}
                      alt="bitcoin"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                  )}
                  {ticketAmount * raffleDetail?.price}{" "}
                  {raffleDetail.sellingTokenTicker}
                </h2>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-neutral-600"></div>
      {/* {raffleActive && ( */}
      <div className="flex flex-col">
        <Button
          variant={"active"}
          onClick={handleOpenPurchaseOverlay}
          disabled={raffleDetail?.status !== "RAFFLE_RUNNING"}
          className="border-none"
        >
          Buy
        </Button>
      </div>
      {/* )} */}
    </>
  );

  return (
    <>
      <div className="flex flex-col w-full gap-5 px-6 pt-5 pb-6 font-bold rounded-xl bg-neutral-800">
        <div className="flex justify-between">
          <h1 className="text-2xl">Join the Raffle</h1>
        </div>
        {renderBuyPanel()}
      </div>
    </>
  );
}
