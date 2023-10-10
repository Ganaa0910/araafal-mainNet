import axios from "axios";
import moment from "moment";
import { useState } from "react";

import FeaturedRaffles from "@/components/featured/FeaturedRaffles";
import { fetchRaffles } from "@/lib/fetcherFunctions";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import raffle from "../../raffleDetails.json";

function App() {
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
    <>
      <div
        className={`flex h-screen max-w-[1440px] mx-auto  -mt-20 flex-col items-center justify-center `}
      >
        <div className="relative w-full h-auto">
          <Image
            src={"/mesh.svg"}
            height={600}
            width={1440}
            className="absolute left-0 right-0 object-none 2xl:object-contain  w-full top-0 h-[177px] md:h-auto"
            alt="mesh"
          />
          <div className="flex items-center justify-center h-full text-3xl font-bold text-center select-none md:text-6xl">
            <div>
              Decentralized Raffling Solution for <br />
              <span className="text-[#FD7C5B]">BRC20s</span>
            </div>
          </div>
        </div>
        {/* <div className="pt-8 text-2xl select-none md:text-4xl">Coming soon</div> */}
        {/* <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center w-full gap-4 pt-8 h-13 md:flex-row md:mr-auto"
          >
            <div className="bg-[#FD7C5B] flex h-[48px] w-[322px] rounded-lg ">
              <input
                type="email"
                className="flex-1 py-3 px-6  rounded-lg text-base md:text-xl bg-black/50   text-[#C4C3C2] placeholder-gray-300 placeholder-opacity-50 focus:ring-0 focus:border-gray-500 "
                placeholder="Email address"
                value={email}
                onChange={handleEmailChange}
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 border-2 h-[48px] w-[322px] md:w-auto text-base md:text-xl flex items-center justify-center button-gradient rounded-lg border-[#FD7C5B] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Submitting" : "Submit"}
            </button>
          </form> */}
        {/* {status == 201 && <div className="mt-2 text-green-600">Success</div>}
          {status == 400 && (
            <div className="mt-2 text-red-600">Email already submitted</div>
          )}

          {status == 500 && (
            <div className="mt-2 text-red-600">Unknown error🥲</div>
          )} */}
      </div>
      <div className="max-w-[1440px] mx-auto h-auto">
        <FeaturedRaffles />
      </div>
      <div className="max-w-[1400px] mx-auto">
        <div className="py-[48px] md:py-[64px] px-4 md:px-[40px] w-full grid grid-cols-1 gap-8 justify-start items-center">
          <div className="grid grid-cols-4 gap-4">
            {data?.map((ins) => (
              <Link key={ins.id} href={`/raffles/${ins.id}`}>
                <div className="flex flex-col h-full w-full border border-gray-50 rounded-xl items-center">
                  <div className="mb-4">
                    <Image
                      src={ins.inscriptionPreviewUrl}
                      alt="Profile"
                      height={100}
                      width={100}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-xl font-semibold mb-2">{ins.name}</div>
                  <div className="text-gray-500 text-sm">
                    {ins.inscriptionId}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* <div className="flex flex-col md:flex-row gap-9">
          <ViewInscription />
          <InfoSection />
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          <InscriptionDetails />
          <BuyPanel tokens={tokens} />
          <Leaderboard tokens={tokens} getAddressDetail={getAddressDetail} />
        </div> */}
        </div>
      </div>
    </>
  );
}

export default App;
