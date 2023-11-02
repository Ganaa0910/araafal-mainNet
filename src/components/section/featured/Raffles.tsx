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

const Raffles = ({ data }: { data: Raffle[] | undefined }) => {
  const { isLoading: featuredLoading, data: featuredRaffles } = useQuery({
    queryKey: ["featuredRaffles"],
    queryFn: fetchFeaturedRaffles,
  });

  // console.log(
  //   "🚀 ~ file: index.tsx:13 ~ Index ~ featuredRaffles:",
  //   featuredRaffles,
  // );

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

  return (
    <div className="swiper w-[1240px] mx-auto">
      <div className="swiper-wrapper">
        {featuredRaffles?.slice(0, 4).map((ins) => (
          <div className="swiper-slide px-8" key={ins.id}>
            <div className="w-full mx-auto h-[432px] border-2 rounded-2xl border-lightblue flex flex-row p-6 gap-10 bg-two-vector bg-cover relative">
              <div className="absolute top-0 right-0 m-6 bg-secondary-less border rounded border-secondaryLinear w-[168px] h-[44px] grid place-items-center">
                <div className="font-normal text-xl">25H : 45M : 12S</div>
              </div>

              <div className="absolute bottom-0 right-0 m-6 w-[280px]">
                <Button
                  variant="featured"
                  className="featured-gradient w-full  "
                >
                  Buy ticket
                </Button>
              </div>
              <Image
                alt="featured Raffle"
                width={384}
                height={384}
                src={ins.inscriptionPreviewUrl}
                className="rounded rounded-2xl"
              />

              <div className="flex flex-col gap-5">
                <div className="w-full h-full">
                  <div className="flex flex-col">
                    <h1 className="text-featured mt-8">{ins.name}</h1>
                    {/* <p className="text-blue-400 text-blueFont">{ins.name}</p> */}
                  </div>
                </div>
                <div className="w-full h-full">
                  <p className="text-xl">{ins.description}</p>
                </div>
                <div className="flex flex-col w-full h-full gap-3">
                  <div className="flex flex-row gap-3 text-2xl">
                    <Image
                      width={32}
                      height={32}
                      src={"bitcoin.svg"}
                      alt="bitcoin"
                    />
                    <p>{ins.price}</p>
                  </div>
                  <div className="flex flex-row gap-3 text-2xl">
                    <Image
                      width={32}
                      height={32}
                      src={"ticket.svg"}
                      alt="ticket"
                    />
                    <p>128 sold</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="swiper-pagination"></div>
    </div>
  );
};
export default Raffles;
