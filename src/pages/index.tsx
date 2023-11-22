import HomeRaffles from "@/components/section/home-raffles";
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
import Link from "next/link";
function App() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["raffles"],
    queryFn: fetchRaffles,
  });
  if (isMobile) {
    return <MobileOnlyScreen />;
  }

  return (
    // <Layout>
    <>
      <Navbar />

      <div className="min-h-screen">
        <div className="absolute top-0 left-0 flex items-center justify-end w-1/2 h-screen">
          <div className="absolute right-0 h-[200px]">
            <Image
              src={"/mesh.svg"}
              height={600}
              width={1440}
              className="object-cover object-right w-full h-full "
              alt="mesh"
            />
          </div>

          <div className="relative z-30 flex min-h-screen items-center h-24 mr-4">
            <div className="flex items-center max-w-[700px] text-white justify-end  text-3xl h-[170px] font-bold select-none text-end md:text-6xl">
              <div>
                Decentralized Raffling Solution for{" "}
                <span className="text-brand">BRC20s</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 z-0 w-[60%] h-screen">
          <Image
            src={"/images/banner-3col.png"}
            layout="fill"
            objectFit="cover"
            objectPosition="0% 100%"
            alt="banner"
          />
        </div>
      </div>
      <div className="max-w-[1440px] container flex flex-col gap-[120px] mb-[260px] mx-auto text-white ">
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl">
          <Image
            src={"/images/host.png"}
            height={592}
            width={488}
            alt="host"
            className="w-full h-full"
          />
          <div className="flex items-center justify-start w-full bg-neutral500">
            <div className="flex flex-col items-start gap-4 p-16 text-start">
              <div className="text-4xl font-bold">
                <span className="text-brand">Host</span> and{" "}
                <span className="text-brand">Earn</span>
              </div>
              <div className="text-neutral100">
                Everyone can create raffle from now!!!
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-20">
          <div className="w-[1216px] mx-auto flex flex-col">
            <div className="flex flex-col mb-12 mb -12">
              <h1 className="text-4xl text-featuredRaffles">
                Featured raffles
              </h1>
              <span className="inline-block w-24 h-2 bg-gradient-to-r from-cyan-500 to-blue-500"></span>
            </div>

            <Raffles data={data?.raffles} />
          </div>
          <HomeRaffles data={data?.raffles} />
        </div>
        <div className="flex flex-col gap-16">
          <div className="flex items-center justify-between w-full gap-16 ">
            <div className="flex flex-col gap-6">
              <div className="text-4xl font-bold">
                What is <span className="text-brand">PSAT</span> token?
              </div>
              <div className="text-xl text-neutral100">
                $PSAT is a BRC-20 token that fuels the growth of Araafal and
                Ordydrops. Sats that are designed for Punks, which offers you
                unique possibilities to explore our platform. Total supply is
                hardcapped at 10 million and the supply will only decrease as
                our project grows.
              </div>
            </div>
            <div className="bg-neutral500 rounded-2xl flex items-center justify-center w-[350px] h-[350px] shrink-0">
              <Image
                src="/images/psat-grad.png"
                height={400}
                width={400}
                alt="psat"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-2 px-16 pt-8 pb-6 border rounded-2xl secondary-gradient border-brand">
              <div className="text-5xl ">10mln</div>
              <div className="text-xl">Total supply</div>
            </div>
            <div className="flex flex-col items-center gap-2 px-16 pt-8 pb-6 -mt-[10px] border rounded-2xl secondary-gradient border-brand">
              <div className="flex gap-2">
                <Image
                  src={"/images/fire.svg"}
                  height={60}
                  width={60}
                  className=""
                />
                <div className="text-5xl font-bold">450k</div>
              </div>
              <div className="text-xl ">Burned tokens</div>
            </div>

            <div className="flex flex-col items-center gap-2 px-16 pt-8 pb-6 border rounded-2xl secondary-gradient border-brand">
              <div className="text-5xl">4.5%</div>
              <div className="text-xl">Burned percent</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-16">
          <div className="flex items-center justify-center w-full">
            <div className="flex flex-col items-center gap-4 ">
              <div className="text-4xl font-bold">Coming soon...</div>
              <span className="inline-block h-2 w-[120px] bg-gradient-to-r from-orange-300 to-orange-600"></span>
            </div>
          </div>
          <div className="flex items-center gap-16">
            <div className="bg-neutral500 rounded-2xl flex items-center justify-center w-[350px] h-[350px] shrink-0">
              <Image src={"/images/psat-fusion.png"} height={384} width={384} />
            </div>
            <div className="flex items-center h-full gap-6">
              <div className="flex flex-col gap-6">
                <div className="text-3xl">
                  Stake <span className="text-brand"> Satoshi Punks </span>&{" "}
                  <span className="text-brand">PepePunks</span> and earn $PSAT
                  in araafal platform
                </div>
                <div className="text-xl text-neutral100">
                  Stake your Satoshi Punks and PepePunks on Araafal – it&apos;s
                  like giving your crypto a spa day, and in return, you earn
                  $PSAT, the VIP treatment for your wallet.
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center w-full gap-16">
            <div className="flex items-center h-full gap-6">
              <div className="flex flex-col gap-6">
                <div className="text-3xl">
                  Stake <span className="text-brand">$PSAT</span> to earn other
                  #BRC-20
                </div>
                <div className="text-xl text-neutral100">
                  Turn your $PSAT into a crypto party mix by staking it and
                  earning a variety of #BRC-20 tokens. It&apos;s like having a
                  DJ for your investments – more beats, more gains!
                </div>
              </div>
            </div>
            <div className="bg-neutral500 rounded-2xl flex items-center justify-center w-[350px] h-[350px] shrink-0">
              <Image src={"/images/brc20s.png"} height={384} width={384} />
            </div>
          </div>
          <div className="flex items-center w-full gap-16 ">
            <div className="bg-neutral500 rounded-2xl flex items-center justify-center w-[350px] h-[350px] shrink-0">
              <Image
                src={"/images/featured-raffle.png"}
                height={384}
                width={384}
              />
            </div>
            <div className="flex items-center h-full gap-6">
              <div className="flex flex-col gap-6">
                <div className="text-3xl">
                  Create{" "}
                  <span className="text-secondaryLinear">Featured raffle</span>{" "}
                  in araafal platfrom
                </div>
                <div className="text-xl text-neutral100">
                  Want your Ordinals to be the life of the party? Host a
                  featured raffle on Araafal and watch as everyone scrambles to
                  win
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-8">
          <div className="flex gap-8 p-8 rounded-xl bg-neutral500">
            <Image
              src={"/images/coin-gecko-logo.png"}
              height={120}
              width={120}
            />
            <div className="flex flex-col justify-between">
              <div className="text-3xl">CoinGecko</div>
              <Link
                target="_blank"
                href={"https://www.coingecko.com/en/coins/punk-sat"}
                className="flex items-center gap-1 text-lg"
              >
                Visit
                <Image src={"/images/arrow-right.svg"} height={6} width={7} />
              </Link>
            </div>
          </div>
          <div className="flex gap-8 p-8 rounded-xl bg-neutral500">
            <Image
              src={"/images/gitbook.png"}
              height={120}
              width={120}
              className="bg-white rounded-full"
            />
            <div className="flex flex-col justify-between">
              <div className="text-3xl">Gitbook</div>
              <Link
                target="_blank"
                href={"https://gitbook.araafal.com"}
                className="flex items-center gap-1 text-lg"
              >
                Visit
                <Image src={"/images/arrow-right.svg"} height={6} width={7} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
