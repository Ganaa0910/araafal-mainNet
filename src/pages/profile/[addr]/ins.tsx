import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import ProfileTabs from "@/components/profile/profile-tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getInscriptionsTestnet } from "@/lib/service";
import { useWalletStore } from "@/slices/walletStore";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/router";

const MyInscriptions = () => {
  const router = useRouter();
  const slug = router.query.slug;
  const { isConnected, connectedAddress, setConnectedAddress, setConnected } =
    useWalletStore();

  const { data: inscriptions, isLoading } = useQuery({
    queryKey: ["inscriptions"],
    queryFn: () => {
      return getInscriptionsTestnet(connectedAddress);
    },
    enabled: isConnected == true,
  });
  useEffect(() => {
    if (typeof slug === "string") {
      if (
        (slug && connectedAddress && slug !== connectedAddress) ||
        !isConnected
      ) {
        router.replace(`/users/${slug}/raf`);
      }
    }
  }, [slug, connectedAddress, isConnected]);
  return (
    <Layout>
      <PageTitle name="Profile" />
      <div className="grid h-auto grid-cols-12 gap-8">
        <div className="col-span-3">
          <ProfileTabs connectedAddress={connectedAddress} />
        </div>

        <div className="col-span-9 min-h-[694px] flex flex-col border-2 border-brand rounded-lg px-6 pt-5 pb-6 gap-5 bg-brandBlack ">
          <div className="text-2xl text-grey-300">My inscriptions</div>
          <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              <div>loading</div>
            ) : inscriptions && inscriptions.length > 0 ? (
              inscriptions.map((ins) => (
                <div
                  key={ins.inscriptionId}
                  className="flex flex-col min-h-[280px] w-[202px] rounded-xl items-center"
                >
                  <div className="mb-4">
                    <div className="rounded-lg w-52 h-52">
                      <AspectRatio ratio={1}>
                        <Image
                          className="object-contain w-full h-full rounded-md"
                          src={`https://testnet.ordinals.com/content/${ins.inscriptionId}`}
                          alt="Card"
                          height={100}
                          width={100}
                        />
                      </AspectRatio>
                    </div>
                    <div className="pt-3 pb-4 text-center">
                      <div className="text-base font-medium text-whiteish">
                        ID. {ins.inscriptionId.substring(0, 5)} ...
                        {ins.inscriptionId.substring(
                          ins.inscriptionId.length - 5,
                          ins.inscriptionId.length - 1,
                        )}
                      </div>
                      <div className="text-xl font-medium text-whiteish">
                        NO. {ins.inscriptionNumber}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="grid items-center h-full col-span-9 gap-6 mt-10 text-center">
                <Image
                  alt="smile"
                  width={72}
                  height={72}
                  src={"/smile.svg"}
                  className="mx-auto"
                />
                <h1 className="mb-2 text-2xl font-bold text-neutral100 ">
                  Haven&apos;t inscribed any raffle bro.
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default MyInscriptions;
