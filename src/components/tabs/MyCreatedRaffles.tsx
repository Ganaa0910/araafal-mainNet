import { Button } from "../ui/button";

const MyCreatedRaffles = () => {
  return (
    <div className="w-[904px] h-auto grid grid-cols-3 border border-gray-50 rounded-lg px-6 pt-5 pb-6 gap-5 overflow-auto">
      <div className="h-auto overflow-hidden bg-white shadow-lg rounded-2xl">
        <img
          className="object-cover w-70 h-70"
          src="/bitcoinbandit.svg"
          alt="Card"
        />
        <div className="">
          <p className="text-base text-gray-700">Bitcoin Bandit #247</p>
          <p className="text-base text-gray-700">0.67 PSAT</p>
          <p className="text-base text-gray-700">0 sold</p>
        </div>
        <div className="flex flex-col">
          <Button>View</Button>
          <Button>Cancel</Button>
        </div>
      </div>
    </div>
  );
};
export default MyCreatedRaffles;
