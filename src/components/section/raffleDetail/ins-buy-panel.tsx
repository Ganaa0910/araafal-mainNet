import { Button } from "@/components/ui/button";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTicketAmount } from "@/slices/mainSlice";
import raffle from "../../../../raffleDetails.json";
import PurchaseOverlay from "@/components/PurchaseOverlay";
import { Raffle, Ticket } from "@/lib/types/dbTypes";

export default function BuyPanel({
  tokens,
  raffleDetail,
  tickets,
}: {
  raffleDetail: Raffle | undefined;
  tickets: Ticket[];
}) {
  const ticket = useSelector((state) => state.ticket);
  const dispatch = useDispatch();

  const [raffleActive, setRaffleActive] = useState(true);
  const [isPurchaseOverlayOpen, setIsPurchaseOverlayOpen] = useState(false);

  const handleInputChange = (e) => {
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

  const renderBuyPanel = () => (
    <>
      <div className="grid grid-cols-2">
        <div className="pb-6">
          <p className="pb-2 text-base text-lighterGray">Price per ticket</p>
          <h2 className="text-3xl">
            {raffleDetail?.price} {raffleDetail?.sellingTokenTicker}
          </h2>
        </div>
        <div className="pb-6">
          <p className="pb-2 text-base">Tickets purchiased</p>
          <h2 className="text-3xl">{tickets?.length}</h2>
        </div>
        <div className="flex justify-start w-full col-span-2" role="group">
          <div className="flex flex-col w-full">
            <p className="pb-2 text-base">Select amount</p>
            <div className="flex flex-row justify-between w-full group">
              <div className="flex items-center px-5 py-2 text-lg border rounded-lg border-lightGray bg-primaryBrand">
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
                    className="p-0 text-3xl text-white border-none rounded-l-none rounded-r select-none bg-inherit"
                    onClick={handleIncrement}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="w-1/2 md:pb-0">
                <p className="pb-2 text-base">Total cost</p>
                {raffleDetail && (
                  <h2 className="text-3xl">
                    {ticket.amount * raffleDetail?.price}{" "}
                    {raffleDetail.sellingTokenTicker}
                  </h2>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {raffleActive && (
        <div className="flex flex-col">
          {/* <p className="inline-block w-full pb-6 text-base break-all select-all bg-defaultGray text-start">
              {raffleDetail?.ownerId}
            </p> */}
          {/* <button
            className="text-base bg-defaultGray border-lightGray px-[16px] py-[12px] h-[48px] w-full md:w-auto hover:bg-darkerLightGray hover:border-lightGray"
            onClick={handleOpenPurchaseOverlay}
          >
            Purchase
          </button> */}
          <Button variant={"primary"}>Purchase</Button>

          <PurchaseOverlay
            isOpen={isPurchaseOverlayOpen}
            onClose={handleClosePurchaseOverlay}
            raffleDetail={raffleDetail}
          />
        </div>
      )}
      {/* <div className="w-full h-0.5 bg-lightGray"></div>
      <div className="flex flex-col">
        <CountdownTimer />
      </div> */}
    </>
  );

  return (
    <>
      <div className="rounded-xl w-full p-[24px] flex flex-col border-2 border-primaryBrand gap-[24px] raffle-gradient">
        <div className="flex justify-between">
          <h1 className="text-3xl">Join the Raffle</h1>
        </div>

        {renderBuyPanel()}
      </div>
    </>
  );
}
