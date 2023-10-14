import Image from "next/image";
import { Button } from "../ui/button";
const Raffles = () => {
  return (
    <>
      <div className="w-[1216px] mx-auto h-[432px] border-2 rounded-2xl border-lightblue flex flex-row p-6 gap-10 bg-two-vector bg-cover relative">
        <div className="absolute top-0 right-0 m-6">time</div>
        <div className="absolute bottom-0 right-0 m-6">
          <Button>Buy Ticket s</Button>
        </div>
        <Image
          alt="featured Raffle"
          width={384}
          height={384}
          src={"featuredRaffle.svg"}
        />

        <div className="flex flex-col gap-5">
          <div className="w-full h-full">
            <div className="flex flex-col">
              <h1 className="text-featured">PepePunk</h1>
              <p className="text-blueFont text-blue-400">NO.7</p>
            </div>
          </div>
          <div className="w-full h-full">
            <p className="text-xl">
              This is your chance to own a piece of the internet's most iconic
              character. Grab your raffle tickets now and cross your fingers for
              a chance to win this Rare Pepe NFT. Join the raffle and become a
              part of Pepe's legendary journey!
            </p>
          </div>
          <div className="w-full h-full flex flex-col gap-3">
            <div className="flex flex-row gap-3 text-2xl">
              <Image width={32} height={32} src={"bitcoin.svg"} />
              <p>0.0069 BTC</p>
            </div>
            <div className="flex flex-row gap-3 text-2xl">
              <Image width={32} height={32} src={"ticket.svg"} />
              <p>128 sold</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Raffles;
