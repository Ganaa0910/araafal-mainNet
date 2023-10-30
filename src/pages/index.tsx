import ActiveRaffles from "@/components/section/ActiveRaffles";
import FeaturedRaffles from "@/components/section/featured/FeaturedRaffles";
import { fetchRaffles } from "@/lib/service";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
// import { Chakra_Petch } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import raffle from "../../raffleDetails.json";
import Raffles from "@/components/section/featured/Raffles";
import Layout from "@/components/layout/layout";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

function App() {
  // const chakra = Chakra_Petch({ subsets: ["latin"], weight: ["400", "700"] });
  const [tokens, setTokens] = useState([]);
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["raffles"],
    queryFn: fetchRaffles,
  });
  console.log("🚀 ~ file: index.js:21 ~ App ~ data:", data);
  // const { data: inscriptions } = useQuery({
  //   queryKey: ["inscriptions"],
  //   queryFn: () => {
  //     return getInscriptions("2MxQAQmFGcWAmwjJwHkD2RwaAY4D4DgkdfJ");
  //   },
  // });
  // console.log(
  //   "🚀 ~ file: ins.tsx:24 ~ MyInscriptions ~ inscriptions:",
  //   inscriptions,
  // );
  // useEffect(() => {
  //     getAddressDetail()
  // }, [])

  // if (isLoading) {
  //     return <span>Loading...</span>
  // }

  // if (isError) {
  //     return <span>Error: {error.message}</span>
  // }

  async function getAddressDetail() {
    try {
      let response = await axios({
        method: "get",
        headers: {
          "OK-ACCESS-KEY": process.env.OKLINK_API_KEY,
        },
        url: `https://www.oklink.com/api/v5/explorer/btc/transaction-list?toAddress=${raffle.userAddress}&limit=0&token=${raffle.tokenTicker}`,
      });

      let tokenDatas = response.data.data;

      let result = [];
      let endTime = moment(raffle.endTime, raffle.timeFormat);
      // let startTime = moment(raffle.startTime, raffle.timeFormat);
      if (tokenDatas.length == 0) return;
      for (let i = 0; i < tokenDatas.length; i++) {
        for (let j = 0; j < parseInt(tokenDatas[i].totalPage); j++) {
          for (let k = 0; k < tokenDatas[i].inscriptionsList.length; k++) {
            if (
              endTime.unix() <
              tokenDatas[i].inscriptionsList[k].time / 1000
            ) {
              continue;
            }
            let user = tokenDatas[i].inscriptionsList[k].fromAddress;
            let amount = parseInt(tokenDatas[i].inscriptionsList[k].amount);
            let userExists = result.find((obj) => obj.fromAddress === user);
            if (userExists) {
              userExists.amount += amount;
              userExists.ticket = Math.floor(
                userExists.amount / raffle.ticketPrice,
              );
            } else {
              result.push({
                // Use push to add new objects to the array
                from: user,
                amount: amount,
                ticket: Math.floor(amount / raffle.ticketPrice),
              });
            }
          }
        }
      }
      result.sort((a, b) => b.ticket - a.ticket);
      setTokens(result);

      // unisat added cors

      // let response = await axios({
      //   method: "get",
      //   url: `https://unisat.io/brc20-api-v2/address/${raffle.userAddress}/brc20/${raffle.tokenTicker}/history?start=0&limit=512&type=receive`,
      // });

      // if (response.data.msg == "ok") {
      //   let tokenData = response.data.data;
      //   let resultTransfers = tokenData.detail;
      //   let result = [];
      //   let endTime = moment(raffle.endTime, raffle.timeFormat);
      //   // let startTime = moment(raffle.startTime, raffle.timeFormat);
      //   for (let i = 0; i < resultTransfers.length; i++) {
      //     if (
      //       endTime.unix() < resultTransfers[i].blocktime
      //       // || startTime.unix() > resultTransfers[i].blocktime
      //     )
      //       continue;
      //     let user = resultTransfers[i].from;
      //     let amount = parseInt(resultTransfers[i].amount);
      //     let userExists = result.find((obj) => obj.from === user);
      //     if (userExists) {
      //       userExists.amount += amount;
      //       userExists.ticket = Math.floor(
      //         userExists.amount / raffle.ticketPrice
      //       );
      //     } else {
      //       result.push({
      //         // Use push to add new objects to the array
      //         from: user,
      //         amount: amount,
      //         ticket: Math.floor(amount / raffle.ticketPrice),
      //       });
      //     }
      //   }
      //   result.sort((a, b) => b.ticket - a.ticket);
      //   setTokens(result);
      // }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    // <Layout>
    <div>
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

          <Raffles />
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
