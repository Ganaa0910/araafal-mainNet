import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import ChooseCurrency from "@/components/modal/choose-currency";
import ChooseInscription from "@/components/modal/choose-inscription";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import {
  createRaffle,
  createWalletForRaffle,
  fetchRaffleById,
  getInscriptionsTestnet,
  getUserBRC20Balance,
  updateRaffle,
} from "@/lib/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import RaffleConfirmation from "@/components/modal/raffle-confirmation";
import { InscriptionType, UserBrc20Type } from "@/lib/types";
import { Raffle } from "@/lib/types/dbTypes";
import { toast } from "sonner";
import { useWalletStore } from "@/slices/walletStore";
import { useForm, SubmitHandler } from "react-hook-form";
import RaffleStep from "@/components/ui/raffle-step";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useRouter } from "next/router";
// import useForm

type FormValues = {
  name: string;
  desc: string;
  price: number;
  sellingTicketLimit: number;
};

export default function CreateRaffle() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const slug = router.query.id;

  const { isConnected, connectedAddress } = useWalletStore();

  const [raffleSubmitModal, setRaffleSubmitModal] = useState(false);

  const [chosenInscription, setChosenInscription] =
    useState<InscriptionType | null>(null);
  const [chosenCurrency, setChosenCurrency] = useState({
    id: 1,
    title: "BTC",
    imagePath: "/bitcoin.svg",
  });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [isRaffleFeatured, setIsRaffleFeatured] = useState(false);
  const [newRaffleData, setNewRaffleData] = useState<Raffle | null>(null);
  const [filteredIns, setFilteredIns] = useState<UserBrc20Type[]>([]);
  const [selectedBrc20, setSelectedBrc20] = useState<UserBrc20Type | null>(
    null,
  );
  const paymentTokenTicker = "psat";
  const paymentTokenImage = "/images/psat.png";
  const paymentAmount = 2000;

  const { data: userbrc20s, isLoading: brc20Loading } = useQuery({
    queryKey: ["userbrc20", connectedAddress],
    queryFn: () => {
      return getUserBRC20Balance(connectedAddress);
    },
    enabled: isConnected == true,
  });
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
  console.log("🚀 ~ CreateRaffle ~ raffleDetail:", raffleDetail);
  const { mutateAsync } = useMutation({
    mutationFn: updateRaffle,
    onError: () => {
      // console.log(error);
    },
    onSuccess: async () => {},
  });

  useEffect(() => {
    if (userbrc20s && userbrc20s?.length !== 0) {
      const filteredArray = userbrc20s.filter(
        (item) =>
          item.tick === paymentTokenTicker &&
          parseInt(item.amt) == paymentAmount,
      );
      setFilteredIns(filteredArray);
      setSelectedBrc20(filteredArray[0]);
    }
  }, [userbrc20s]);

  const toggleConfirmation = () => {
    setRaffleSubmitModal(!raffleSubmitModal);
  };

  const waitOneSecond = (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };
  async function sendInscriptionAndName(
    walletAddress: string,
    inscriptionId: string,
  ) {
    let txid = await window.unisat.sendInscription(
      walletAddress,
      inscriptionId,
    );
    console.log("🚀 ~ file: payment-confirmation.tsx:117 ~ txid:", txid);
    return txid;
  }

  async function triggerFeaturedRaffle() {
    if (selectedBrc20 == null) {
      toast.error("Select brc 20 first");
      return setSubmitLoading(false);
    }
    try {
      const psattx = await sendInscriptionAndName(
        "tb1pk4dzxehzkcmqk3c685gukuhjamvcs690tdlemrcrvttjy273gqmsrh2us5",
        selectedBrc20.inscriptionId as string,
      );
      console.log("🚀 ~ triggerFeaturedRaffle ~ psattx:", psattx);

      await waitOneSecond();

      if (!raffleDetail) {
        return;
      }
      if (raffleDetail.id == undefined) {
        return;
      }
      let txid = await window.unisat.sendInscription(
        raffleDetail.nftDepositAddress,
        `${raffleDetail.inscriptionId}`,
      );
      console.log("🚀 ~ triggerFeaturedRaffle ~ txid:", txid);

      const updatedRaffleData = {
        ...raffleDetail,
        featured: true,
        featuredTransanctionId: psattx,
        nftDepositTransactionId: txid,
      };
      if (psattx && txid) {
        await raffleUpdateHandler({
          newRaffleData: updatedRaffleData,
        });
      }
    } catch (error) {
      toast.error("We faced error when creating raffle payment");
      setSubmitLoading(false);
      console.log(error);
    }
  }

  async function triggerNormalRaffle() {
    try {
      if (!raffleDetail) {
        return;
      }
      if (raffleDetail.id == undefined) {
        return;
      }
      let txid = await window.unisat.sendInscription(
        raffleDetail.nftDepositAddress,
        `${raffleDetail.inscriptionId}`,
      );
      console.log("🚀 ~ triggerFeaturedRaffle ~ txid:", txid);

      const updatedRaffleData = {
        ...raffleDetail,
        featured: false,
        nftDepositTransactionId: txid,
      };
      if (txid) {
        await raffleUpdateHandler({
          newRaffleData: updatedRaffleData,
        });
      }
    } catch (error) {
      toast.error("We faced error when creating raffle payment");
      setSubmitLoading(false);
      console.log(error);
    }
  }

  const raffleUpdateHandler = async ({
    newRaffleData,
  }: {
    newRaffleData: Raffle;
  }) => {
    setSubmitLoading(true);

    const response = await mutateAsync({ newRaffleData: newRaffleData });
    if (response && !response.data.error) {
      toast.success("Successfully created raffle");
      setSubmitLoading(false);
      queryClient.invalidateQueries({ queryKey: ["raffles"] });
      router.push(`/createRaffle/${slug}/result`);
    } else if (response && response.data.error) {
      toast.error(response.data.error);
      setSubmitLoading(false);
    }
    setSubmitLoading(false);
  };
  const tokens = [
    { id: 1, title: "BTC", imagePath: "/bitcoin.svg" },
    { id: 2, title: "ORDI", imagePath: "/images/ordi.png" },
    { id: 3, title: "PSAT", imagePath: "/images/psat.png" },
    { id: 4, title: "SATS", imagePath: "/images/sats.png" },
    { id: 5, title: "TRAC", imagePath: "/images/trac.png" },
    { id: 6, title: "JOEM", imagePath: "/images/trac.png" },
  ];

  async function handleInscribeButtonClick() {
    try {
      setSubmitLoading(true);
      const tx = await window.unisat.inscribeTransfer(
        paymentTokenTicker,
        paymentAmount,
      );
      setSubmitLoading(false);
      toast.success(
        "Successfully inscribed. Now wait until block is confirmed",
      );
      // setInscriptionId(tx.inscriptionId);
    } catch (error) {
      toast.error("We faced error when inscribing");
      setSubmitLoading(false);
      console.log(error);
    }
  }

  return (
    <Layout>
      {newRaffleData && (
        <RaffleConfirmation
          show={raffleSubmitModal}
          handleClose={toggleConfirmation}
          newRaffleData={newRaffleData}
        />
      )}
      {/* <PageTitle name="Create Raffle" /> */}

      <RaffleStep step={2} />

      <div className="grid w-full grid-cols-12 gap-8 mb-52">
        <div className="col-span-6 col-start-4">
          <div className="flex flex-col w-full gap-6 px-6 pt-5 pb-6 bg-neutral500 rounded-xl">
            <h1 className="text-2xl font-bold text-center">
              Wanna make it featured?
            </h1>
            <div>You can make your raffle featured with PSAT.</div>
            <div className="flex items-start gap-6">
              <Image
                src={"/images/visibility.svg"}
                height={64}
                width={64}
                alt="visibility"
              />
              <div className="flex flex-col gap-2">
                <h3 className="font-bold t ext-xl">Visibility</h3>
                <div className="">
                  Your featured raffle will be top of default raffles. So your
                  raffle can reach more people and will be include on homepage.
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between text-xl">
                <div>Balance:</div>
                <div className="flex items-center gap-2 ">
                  <Image
                    src={"/images/psat.png"}
                    alt="Your Image"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  86000 PSAT
                </div>
              </div>

              <div className="flex justify-between text-xl">
                <div>Price:</div>
                <div className="flex items-center gap-2 ">
                  <Image
                    src={"/images/psat.png"}
                    alt="Your Image"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  2000 PSAT
                </div>
              </div>
              <div className="flex justify-between text-xl">
                <div>Points:</div>
                <div>+5 pts</div>
              </div>
              <div className="flex justify-between text-xl">
                <div>Transferable balance:</div>
              </div>
              <div className="flex flex-col gap-3">
                {filteredIns && filteredIns.length == 0 ? (
                  <div className="flex gap-6 p-6 rounded-lg bg-black/50">
                    <div className="flex items-center justify-end text">
                      You don’t have proper inscription.
                    </div>
                    <div>
                      <Button
                        variant={"primary"}
                        onClick={handleInscribeButtonClick}
                        disabled={submitLoading}
                      >
                        {submitLoading && (
                          <Icons.spinner
                            className="w-4 h-4 mr-0 md:mr-2 animate-spin "
                            aria-hidden="true"
                          />
                        )}
                        Inscribe now
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-6 p-6 rounded-lg bg-black/50">
                    <div className="grid w-full h-full grid-cols-2 gap-8 text-center ">
                      {filteredIns?.map((ins) => (
                        <div
                          className="flex w-full gap-3"
                          key={ins.inscriptionId}
                        >
                          <button
                            className={`flex gap-3 border w-full py-3 px-5 rounded-lg text-xl font-bold ${
                              selectedBrc20 == ins
                                ? " border-brand"
                                : "border-white"
                            }`}
                            onClick={() => setSelectedBrc20(ins)}
                          >
                            <Image
                              src={
                                paymentTokenImage
                                  ? paymentTokenImage
                                  : "/bitcoin.svg"
                              }
                              alt="Your Image"
                              width={28}
                              height={28}
                              className="w-7 h-7"
                            />
                            {ins.amt} {ins.tick}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 px-2">
                  <Image
                    src={"/images/notice.svg"}
                    height={24}
                    width={24}
                    alt="notice"
                  />
                  Inscribing may take a while around 20-30 min.
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-8 pt-8">
            <button onClick={() => triggerNormalRaffle()}>Skip</button>
            <button onClick={() => triggerFeaturedRaffle()}>Transfer</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
