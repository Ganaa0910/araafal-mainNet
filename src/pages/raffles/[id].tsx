import BuyPanel from "@/components/BuyPanel";
import Footer from "@/components/Footer";
import InscriptionDetail from "@/components/InscriptionDetail";
import InscriptionDetails from "@/components/InscriptionDetails";
import Leaderboard from "@/components/Leaderboard";
import Navbar from "@/components/Navbar";
import ProfileBar from "@/components/ProfileBar";
import ViewInscription from "@/components/ViewInscription";
import { fetchRaffleById, getTicketsByRaffle } from "@/lib/fetcherFunctions";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Detail() {
  const router = useRouter();
  const slug = router.query.id;
  const [tokens, setTokens] = useState([]);
  const {
    isLoading,
    isError,
    data: raffleDetail,
    error,
  } = useQuery({
    queryKey: ["raffleDetail", slug],
    queryFn: () => {
      if (typeof slug === "string") {
        return fetchRaffleById(slug);
      }
    },
    enabled: !!slug,
  });
  const { data: tickets } = useQuery({
    queryKey: ["tickets", slug],
    queryFn: () => {
      if (typeof slug === "string") {
        return getTicketsByRaffle(slug);
      }
    },
    enabled: !!slug,
  });

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
      <Navbar></Navbar>
      <div className="max-w-[1216px] mx-auto h-[850px] mt-12 mb-8">
        <div className="flex flex-col mb -12 mb-12">
          <h1 className="text-featuredRaffles text-4xl">Raffle page</h1>
          <span className="bg-gradient-to-r from-orange-300 to-orange-600 inline-block w-24 h-2"></span>
        </div>
        {/* <div className="py-[48px] md:py-[64px] px-4 md:px-[40px] w-full grid grid-cols-1 gap-8 justify-start items-center">
        <div className="flex flex-col md:flex-row gap-9">
          <ViewInscription raffleDetail={raffleDetail} />
          <InfoSection raffleDetail={raffleDetail} />
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          <InscriptionDetails raffleDetail={raffleDetail} />
          <BuyPanel
            tokens={tokens}
            raffleDetail={raffleDetail}
            tickets={tickets}
          />
          <Leaderboard
            tokens={tokens}
            getAddressDetail={getAddressDetail}
            tickets={tickets}
          />
        </div>
      </div> */}

        <div className="w-full flex flex-row gap-8">
          <div className="flex flex-col w-[280px] gap-8">
            <ViewInscription raffleDetail={raffleDetail} />
            <InscriptionDetails raffleDetail={raffleDetail} />
          </div>

          <div className="flex flex-col w-[488px] gap-8">
            <BuyPanel
              tokens={tokens}
              raffleDetail={raffleDetail}
              tickets={tickets}
            />{" "}
            <InscriptionDetail raffleDetail={raffleDetail} />
          </div>
          <div className="flex flex-col  gap-8 w-[384px]">
            <ProfileBar raffleDetail={raffleDetail} />
            <Leaderboard
              tokens={tokens}
              getAddressDetail={getAddressDetail}
              tickets={tickets}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
