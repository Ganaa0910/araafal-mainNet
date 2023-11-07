import TicketConfirmation from "@/components/modal/ticket-confirmation";
import { Button } from "@/components/ui/button";
import { ReduxAccount, ReduxTicketObject, TicketsByRaffle } from "@/lib/types";
import { Raffle, Ticket } from "@/lib/types/dbTypes";
import { setTicketAmount } from "@/slices/mainSlice";
import moment from "moment";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import raffle from "../../../../raffleDetails.json";
import { getTokenImagePath } from "@/lib/helpers";

export default function BuyPanel({
  raffleDetail,
  tickets,
}: {
  raffleDetail: Raffle | undefined;
  tickets: { rows: TicketsByRaffle[] };
}) {
  const ticket = useSelector((state: ReduxTicketObject) => state.ticket);
  const account = useSelector((state: ReduxAccount) => state.account);
  const dispatch = useDispatch();

  const [raffleActive, setRaffleActive] = useState(true);
  const [isPurchaseOverlayOpen, setIsPurchaseOverlayOpen] = useState(false);

  const handleInputChange = (e: any) => {
    const newAmount = parseInt(e.target.value, 10);
    dispatch(setTicketAmount(newAmount));
  };

  const handleIncrement = () => {
    const newAmount = Math.min(ticket.amount + 1, raffle.maxTicketAmount);
    dispatch(setTicketAmount(newAmount));
  };

  const handleDecrement = () => {
    const newAmount = Math.max(ticket.amount - 1, 1);
    dispatch(setTicketAmount(newAmount));
  };

  useEffect(() => {
    if (raffleDetail) {
      const endTime = moment(raffleDetail.endDate, raffle.timeFormat);
      const currentTime = moment();
      if (currentTime.isBefore(endTime)) {
        setRaffleActive(true);
      }
    }
  }, [raffleDetail]);

  const handleCopyDepositAddressButton = () => {
    navigator.clipboard.writeText(raffle.userAddress);
  };

  const handleOpenPurchaseOverlay = () => {
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
            <p className="pb-2 text-base text-lighterGray">Price per ticket</p>
            <h2 className="flex flex-row text-xl">
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
            <p className="pb-2 text-base">Tickets purchased</p>
            <h2 className="flex flex-row text-xl">
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
            <p className="pb-2 text-base">Select amount</p>
            <div className="flex items-center px-5 py-2 text-lg border-2 rounded-lg border-brand bg-brandBlack w-[138px]">
              <div className="flex justify-between px-6 md:px-0">
                <button
                  className="p-0 text-3xl text-white border-none rounded-r-none select-none bg-inherit"
                  onClick={handleDecrement}
                >
                  -
                </button>
                <input
                  className="w-20 text-2xl text-center focus:border-none bg-inherit focus:outline-none"
                  type="text"
                  min="1"
                  readOnly
                  max="1000"
                  value={ticket.amount}
                  placeholder="1"
                  onChange={(e) => handleInputChange(e)}
                />
                <button
                  className="p-0 text-xl text-white border-none rounded-l-none rounded-r select-none bg-inherit"
                  onClick={handleIncrement}
                  disabled={ticket.amount == 10}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="items-start">
              <p className="pb-2 text-base">Total cost</p>
              {raffleDetail && (
                <h2 className="flex flex-row text-xl">
                  {raffleDetail && (
                    <Image
                      src={getTokenImagePath(raffleDetail.sellingTokenTicker)}
                      alt="bitcoin"
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                  )}
                  {ticket.amount * raffleDetail?.price}{" "}
                  {raffleDetail.sellingTokenTicker}
                </h2>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[2px] bg-brand"></div>
      {raffleActive && (
        <div className="flex flex-col">
          <Button
            variant={"secondary"}
            onClick={handleOpenPurchaseOverlay}
            disabled={
              raffleDetail?.status !== "RAFFLE_RUNNING" ||
              account?.connected == false
            }
          >
            Buy
          </Button>
        </div>
      )}
    </>
  );

  return (
    <>
      <div className="flex flex-col w-full gap-5 px-6 pt-5 pb-6 font-bold border-2 rounded-xl border-brand raffle-gradient">
        <div className="flex justify-between">
          <h1 className="text-2xl">Join the Raffle</h1>
        </div>

        {renderBuyPanel()}
      </div>
    </>
  );
}
