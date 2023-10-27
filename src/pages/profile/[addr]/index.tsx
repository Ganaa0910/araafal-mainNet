import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import Button from "@/components/Button";
// import MyInscriptions from '@/components/MyInscriptions'
import axios from "axios";
import Image from "next/image";
import ProfileTabs from "@/components/profile/profile-tabs";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getUserProfile } from "@/lib/fetcherFunctions";
import Layout from "@/components/layout/layout";
import PageTitle from "@/components/atom/page-title";

export default function Profile() {
  //profile routing ends
  const router = useRouter();

  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const account = useSelector((state) => state.account);

  const slug = router.query.addr;
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile(slug),
    enabled: !!slug,
  });
  console.log("🚀 ~ file: index.tsx:28 ~ Profile ~ error:", error);
  console.log("🚀 ~ file: index.tsx:27 ~ Profile ~ data:", data);

  useEffect(() => {
    router.isReady && getInscriptions();
  }, [router.isReady]);

  async function getInscriptions() {
    try {
      setLoading(true);
      let response = await axios({
        method: "get",
        headers: {
          "OK-ACCESS-KEY": process.env.OKLINK_API_KEY,
        },
        url: `https://www.oklink.com/api/v5/explorer/btc/address-balance-list?address=${slug}`,
      });

      if (response.data.msg == "") {
        let inscriptionDatas = response.data.data;
        let result = [];

        if (inscriptionDatas.length == 0) return;
        for (let i = 0; i < inscriptionDatas.length; i++) {
          for (let j = 0; j < parseInt(inscriptionDatas[i].totalPage); j++) {
            for (let k = 0; k < inscriptionDatas[i].balanceList.length; k++) {
              {
                result.push({
                  name: inscriptionDatas[i].balanceList[k].token,
                  availableBalance:
                    inscriptionDatas[i].balanceList[k].availableBalance,
                  transferBalance:
                    inscriptionDatas[i].balanceList[k].transferBalance,
                  balance: inscriptionDatas[i].balanceList[k].balance,
                });
              }
            }
          }
        }
        setInscriptions(result);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <Layout>
      <PageTitle name="Profile" />
      {/* <div className="py-[48px] md:py-[64px] px-4 md:px-[40px] w-full grid grid-cols-1 gap-8 justify-start items-center bg-red-600"> */}
      <div className="flex flex-row items-center justify-start w-full h-auto gap-4 ">
        <ProfileTabs />

        {/* <MyInscriptions></MyInscriptions> */}
        {/* <MyCreatedRaffles></MyCreatedRaffles> */}

        {/* <myProfile></myProfile> */}
        {/* <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-col md:flex-row gap-9">
            {slug?.slice(0, 6) +
              "..." +
              slug?.slice(slug?.length - 4, slug?.length)}
          </div>
        </div>
        <div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div>
              BRC-20:
              <div className="grid grid-cols-5 gap-4 text-white">
                {inscriptions?.map((inscription, index) => (
                  <div key={index}>
                    <button className="flex flex-col p-6 border border-white">
                      <div className="flex justify-between">
                        <div>{inscription.name}</div>
                      </div>
                      <div className="flex justify-between text-sm text-lightGray">
                        <div>Transferable: </div>
                        <div>{inscription.transferBalance}</div>
                      </div>
                      <div className="flex justify-between text-sm text-lightGray">
                        <div>Available: </div>
                        <div>{inscription.availableBalance}</div>
                      </div>
                      <div className="w-full h-0.5 bg-lightGray"></div>
                      <div className="flex justify-between text-sm text-lightGray">
                        <div>Balance: </div>
                        <div>{inscription.balance}</div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div> */}
      </div>
    </Layout>
  );
}
