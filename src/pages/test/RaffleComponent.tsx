import Image from "next/image";
import data from "./data.json";

export default function RaffleComponent() {
  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          <div
            key={item.id}
            className={`w-full h-[116px] flex flex-row justify-between items-center`}
          >
            <div className="flex flex-row gap-4">
              <div className="w-[100px] h-[100px] object-contain">
                <Image
                  width={100}
                  height={100}
                  className="w-auto h-full"
                  src={item.imageSrc}
                  alt="img"
                />
              </div>
              <div className="flex flex-col items-center justify-center h-full">
                <h1>{item.name}</h1>
                <p>{item.ticketNumber}</p>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center text-left w-">
              <h1> {item.count}</h1>
              <Image
                src={"/ticket.svg"}
                width={1}
                height={1}
                className="w-8 h-8"
                alt="img"
              />
            </div>
            <div className="items-end text-left">
              {item.ticketStatus === "TICKET_ENDED" && (
                <button
                  className={`w-[133px] flex flex-row text-center text-2xl  bg-defaultGray border-lightGray px-[16px] py-[12px] h-auto border-white`}
                >
                  <Image
                    alt="claim"
                    src={"/claim.svg"}
                    width={1}
                    height={1}
                    className="w-6 h-6"
                  />
                  Claim
                </button>
              )}
              {item.ticketStatus === "TICKET_RUNNING" && (
                <button
                  className={`w-[133px] flex flex-row text-center text-2xl  bg-defaultGray border-lightGray px-[16px] py-[12px] h-auto border-white`}
                >
                  <Image
                    alt=""
                    src={"/claim.svg"}
                    width={1}
                    height={1}
                    className="w-6 h-6"
                  />
                  Running
                </button>
              )}
              {item.ticketStatus === "TICKET_ENDED" && (
                <button
                  className={`w-[133px] flex flex-row text-center text-2xl  bg-defaultGray border-lightGray px-[16px] py-[12px] h-auto border-white`}
                >
                  <Image
                    alt=""
                    src={"/claim.svg"}
                    width={1}
                    height={1}
                    className="w-6 h-6"
                  />
                  Ended
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
