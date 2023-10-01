import Button from "@/components/Button";
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
  console.log(
    "🚀 ~ file: index.tsx:57 ~ CreateRaffle ~ inscriptions:",
    inscriptions,
  );

  return (
    <div className="max-w-[1216px] mx-auto flex flex-row">
      <div className=" flex flex-row gap-4 h-auto w-full">
        <ProfileTabs />

        <div className="w-[904px] h-[694px] flex flex-col border border-gray-50 rounded-lg px-6 pt-5 pb-6 gap-5 overflow-auto">
          <div className="text-grey-300 text-2xl">My inscriptions</div>
          <div className="grid grid-cols-4 gap-4">
            {inscriptions?.map((ins) => (
              <div
                key={ins}
                className="flex flex-col h-[280px] w-[202px] border border-gray-50 rounded-xl items-center"
              >
                <div className="mb-4">
                  <Image
                    className="w-full  rounded-md"
                    src={`https://testnet.ordinals.com/content/${ins}i0`}
                    alt="Card"
                    height={100}
                    width={100}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyInscriptions;
