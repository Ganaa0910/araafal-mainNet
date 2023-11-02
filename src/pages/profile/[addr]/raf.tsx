import { useRouter } from "next/router";

import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import ProfileTabs from "@/components/profile/profile-tabs";
import { Button } from "@/components/ui/button";
import { getUserRaffles } from "@/lib/service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ReduxAccount } from "@/lib/types";

// export default function Raf() {
//   //profile routing ends
//   const router = useRouter();

//   const slug = router.query.addr;
//   const { data: raffles } = useQuery({
//     queryKey: ["raffleTitle", slug],
//     queryFn: () => {
//       if (typeof slug === "string") {
//         return getUserRaffles(slug);
//       }
//     },
//     enabled: !!slug,
//   });

//   return (
//     <Layout>
//       <PageTitle name="Profile" />
//       {/* <div className="py-[48px] md:py-[64px] px-4 md:px-[40px] w-full grid grid-cols-1 gap-8 justify-start items-center bg-red-600"> */}
//       <div className="flex flex-row w-full h-auto gap-4 ">
//         <ProfileTabs />
//         <div className="w-[904px] h-auto grid grid-cols-3 border-2 border-brand bg-brandBlack  rounded-lg px-6 pt-5 pb-6 gap-5 overflow-auto">
//           {raffles?.map((raffle) => (
//             <div
//               key={raffle.id}
//               className="h-auto overflow-hidden border shadow-lg rounded-2xl"
//             >
//               <div>
//                 <div className="absolute px-3 py-1 mt-3 ml-3 bg-black bg-opacity-50 border rounded-lg select-none">
//                   {raffle.status}
//                 </div>
//                 <div className="rounded-lg">
//                   <Image
//                     className="object-cover w-70 h-70"
//                     src={raffle.inscriptionPreviewUrl}
//                     alt="Card"
//                   />
//                 </div>
//               </div>
//               <p className="px-6 pt-2 font-bold text-gray-300">{raffle.name}</p>
//               <p className="px-6 pt-2 font-bold text-gray-300">
//                 {raffle.price} {raffle.sellingTokenTicker}
//               </p>
//               <p className="px-6 pt-2 font-bold text-gray-300">
//                 {/* 0 if 0 */}
//                 {raffle.soldAmount == 0 ? 0 : raffle.soldAmount} sold
//               </p>
//               <div className="flex flex-col gap-2 p-2 px-6">
//                 <Button>View</Button>
//                 <Button>Cancel</Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </Layout>
//   );
// }

export default function Raf() {
  const account = useSelector((state: ReduxAccount) => state.account);
  const router = useRouter();
  const slug = router.query.addr;
  const { data: raffles, isLoading } = useQuery({
    queryKey: ["raffleTitle", slug],
    queryFn: () => {
      if (typeof slug === "string") {
        return getUserRaffles(slug);
      }
    },
    enabled: !!slug,
  });

  return (
    <Layout>
      <PageTitle name="Profile" />
      <div className="flex flex-row w-full h-auto gap-4 ">
        <ProfileTabs account={account} />
        <div className="w-[904px] h-auto grid grid-cols-3 border-2 border-brand bg-brandBlack  rounded-lg px-6 pt-5 pb-6 gap-5 overflow-auto">
          {!isLoading && raffles && raffles?.length > 0 ? (
            raffles.map((raffle) => (
              <div
                key={raffle.id}
                className="h-auto overflow-hidden border shadow-lg rounded-2xl"
              >
                <div>
                  <div className="absolute px-3 py-1 mt-3 ml-3 bg-black bg-opacity-50 border rounded-lg select-none">
                    {raffle.status}
                  </div>
                  <div className="rounded-lg">
                    <Image
                      className="object-cover w-70 h-70"
                      width={300}
                      height={300}
                      src={raffle.inscriptionPreviewUrl}
                      alt="Card"
                    />
                  </div>
                </div>
                <p className="px-6 pt-2 font-bold text-gray-300">
                  {raffle.name}
                </p>
                <p className="px-6 pt-2 font-bold text-gray-300">
                  {raffle.price} {raffle.sellingTokenTicker}
                </p>
                <p className="px-6 pt-2 font-bold text-gray-300">
                  {/* 0 if 0 */}
                  {/* {raffle.soldAmount == 0 ? 0 : raffle.soldAmount} */}
                  sold
                </p>
                <div className="flex flex-col gap-2 p-2 px-6">
                  <Button>View</Button>
                  <Button>Cancel</Button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center h-full col-span-3 gap-6 mt-5">
              <Image alt="smile" width={72} height={72} src={"/smile.svg"} />
              <h1 className="mb-2 text-2xl font-bold text-neutral100 ">
                You haven`&apos;`t created any raffle bro.
              </h1>
              <div className="w-[280px]">
                <Button variant={"primary"} className="w-full">
                  <Link href={"/createraffle"}>Create raffle</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
