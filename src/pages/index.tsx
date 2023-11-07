import ActiveRaffles from "@/components/section/ActiveRaffles";
import { fetchRaffles } from "@/lib/service";
import { useQuery } from "@tanstack/react-query";
// import { Chakra_Petch } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Raffles from "@/components/section/featured/Raffles";
import Image from "next/image";
import MobileOnlyScreen from "@/components/section/mobile-only";
import { isMobile } from "react-device-detect";
import MaintainanceScreen from "@/components/section/maintainance";

function App() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["raffles"],
    queryFn: fetchRaffles,
  });
  // if (isMobile) {
  //   return <MaintainanceScreen />;
  // } else {
  //   return <MaintainanceScreen />;
  // }

  return (
    // <Layout>
    <div>
      <Image
        src="/bg.svg"
        height={1440}
        width={1440}
        className="z-0 select-none top-gradient"
        alt="bg"
      />
      <Navbar />
      <div
        className={`flex h-screen  mx-auto  z-10 -mt-20 flex-col items-center justify-center `}
      >
        <div className="relative w-full h-auto">
          <Image
            src={"/mesh.svg"}
            height={600}
            width={1440}
            className="absolute left-0 right-0 z-0 object-none 2xl:object-contain  w-full top-0 h-[177px] md:h-auto"
            alt="mesh"
          />
          <div className="flex items-center justify-center h-full text-3xl font-bold text-center select-none md:text-6xl">
            <div>
              Decentralized Raffling Solution for <br />
              <span className="text-[#FD7C5B]">BRC20s</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto h-[500px] mb-80">
        <div className="w-[1216px] mx-auto flex flex-col">
          <div className="flex flex-col mb-12 mb -12">
            <h1 className="text-4xl text-featuredRaffles">Featured raffles</h1>
            <span className="inline-block w-24 h-2 bg-gradient-to-r from-cyan-500 to-blue-500"></span>
          </div>

          <Raffles data={data} />
        </div>
      </div>

      <div className="pb-40 mb-[144px]">
        <ActiveRaffles data={data} />
      </div>
      <Footer />
    </div>
    // </Layout>
  );
}

export default App;
