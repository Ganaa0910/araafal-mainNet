import ProfileTabs from "@/components/profile/profile-tabs";
import {
  getInscriptions,
  getInscriptionsTestnet,
} from "@/lib/fetcherFunctions";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";
import DummyBalance from "../../../components/DummyBalance.json";
import Layout from "@/components/layout/layout";

const MyInscriptions = () => {
  const account = useSelector((state) => state.account);
  const [walletInfo, setWalletInfo] = useState({});
  //profile routing ends
  const router = useRouter();

  const slug = router.query.addr;

  const { data: inscriptions } = useQuery({
    queryKey: ["inscriptions"],
    queryFn: () => {
      return getInscriptionsTestnet(account.address);
    },
    enabled: account.connected == true,
  });

  return (
    <Layout>
      <div className="max-w-[1216px] mx-auto flex flex-row">
        <div className="flex flex-row w-full h-auto gap-4 ">
          <ProfileTabs />

          <div className="w-[904px] h-[694px] flex flex-col border border-gray-50 rounded-lg px-6 pt-5 pb-6 gap-5 bg-black bg-opacity-50 overflow-auto ">
            <div className="text-2xl text-grey-300">My inscriptions</div>
            <div className="grid grid-cols-4 gap-4">
              {DummyBalance?.list.map((ins) => (
                <div
                  key={ins}
                  className="flex flex-col h-[280px] w-[202px] rounded-xl items-center"
                >
                  <div className="mb-4">
                    <div className="border rounded-lg w-52 h-52">
                      <Image
                        className="w-full rounded-md"
                        src={`https://testnet.ordinals.com/content/${ins.inscriptionId}`}
                        alt="Card"
                        height={100}
                        width={100}
                      />
                    </div>
                    <div className="pt-3 pb-4 text-center">
                      <div className="text-base font-medium text-whiteish">
                        {ins.inscriptionName} Pepe Punks
                      </div>
                      <div className="text-xl font-medium text-whiteish">
                        NO. {ins.inscriptionNumber}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default MyInscriptions;
