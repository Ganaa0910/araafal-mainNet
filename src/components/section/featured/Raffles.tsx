import { Button } from "@/components/ui/button";
import { fetchFeaturedRaffles } from "@/lib/service";
import { Raffle } from "@/lib/types/dbTypes";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect } from "react";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
Swiper.use([Navigation, Pagination]);
import Countdown from "react-countdown";
import { getTokenImagePath, utcToLocalTime } from "@/lib/helpers";
import Link from "next/link";

const Raffles = ({ data }: { data: Raffle[] | undefined }) => {
  console.log("🚀 ~ file: Raffles.tsx:18 ~ Raffles ~ data:", data);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const swiper = new Swiper(".swiper", {
        modules: [Navigation, Pagination],
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    }
  }, []);

  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
      // Render a completed state
      return <div className="">Ended</div>;
    } else {
      // Render a countdown
      return (
        <div className="">
          {hours}H : {minutes}M : {seconds}S
        </div>
      );
    }
  };

  return (
    <div className="swiper w-[1240px] mx-auto">
      <div className="swiper-wrapper">
        {data?.length != 0 &&
          data
            ?.filter((ins) => ins.featured === true)
            .reverse()
            .slice(-4)
            .reverse()
            .map((ins) => (
              <div key={ins.id} className="px-8 swiper-slide">
                <Link href={`/raffles/${ins.id}`}>
                  <div className="w-full mx-auto h-[432px]  bg-neutral600 border-2 rounded-2xl border-lightblue flex flex-row p-6 gap-10 bg-two-vector bg-cover relative">
                    <div className="absolute top-0 right-0 m-6 bg-secondary-less border rounded border-secondaryLinear w-[168px] h-[44px] grid place-items-center">
                      <div className="text-xl font-normal">
                        <Countdown
                          date={utcToLocalTime(ins.endDateUnix)}
                          renderer={renderer}
                        />
                      </div>
                    </div>

                    <div className="absolute bottom-0 right-0 m-6 w-[280px]">
                      <Link href={`/raffles/${ins.id}`}>
                        <Button
                          variant="featured"
                          className="w-full featured-gradient "
                        >
                          Buy ticket
                        </Button>
                      </Link>
                    </div>
                    <Image
                      alt="featured Raffle"
                      width={384}
                      height={384}
                      src={ins.inscriptionPreviewUrl}
                      className=" rounded-2xl"
                    />

                    <div className="flex flex-col gap-5">
                      <div className="w-full h-full">
                        <div className="flex flex-col">
                          <h1 className="mt-4 text-featured">{ins.name}</h1>
                          {ins.inscriptionNumber && (
                            <h3 className="text-secondaryLinear text-blueTitle">
                              NO. {ins.inscriptionNumber}
                            </h3>
                          )}
                        </div>
                      </div>
                      <div className="w-full h-full">
                        <p className="text-xl">{ins.description}</p>
                      </div>
                      <div className="flex flex-col w-full h-full gap-3">
                        <div className="flex flex-row items-center justify-start w-full gap-3 text-lg font-bold">
                          <Image
                            width={32}
                            height={32}
                            src={getTokenImagePath(ins.sellingTokenTicker)}
                            alt="bitcoin"
                          />
                          <p>
                            {ins.price} {ins.sellingTokenTicker}
                          </p>
                        </div>
                        <div className="flex flex-row items-center justify-start w-full gap-3 text-lg font-bold">
                          <Image
                            src={"ticket.svg"}
                            alt="ticket"
                            width={32}
                            height={32}
                          />
                          <p>{ins.ticket_count} sold</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
      </div>
      <div className="swiper-pagination"></div>
    </div>
  );
};
export default Raffles;
