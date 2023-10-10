import Image from "next/image";
const Raffles = () => {
  return (
    <>
      <div className="w-[1216px] mx-auto h-full border-2 rounded-2xl border-lightblue flex flex-row p-6 gap-10 bg-two-vector bg-cover relative">
        <div className=""></div>
        <div className="">
          <Image
            alt="featured Raffle"
            width={384}
            height={384}
            src={"featuredRaffle.svg"}
            className=""
          ></Image>
        </div>
        <div className="flex flex-col gap-5">
          <div className="w-full h-full bg-red-500">
            <div className="flex flex-row">
              <div className="">
                <h1>PepePunk</h1>
                <p>NO.7</p>
              </div>
            </div>
          </div>
          <div className="w-full h-full bg-red-500"></div>
          <div className="w-full h-full bg-red-500"></div>
        </div>
      </div>
    </>
  );
};
export default Raffles;
