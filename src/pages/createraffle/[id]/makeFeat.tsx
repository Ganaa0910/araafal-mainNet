import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import ChooseCurrency from "@/components/modal/choose-currency";
import ChooseInscription from "@/components/modal/choose-inscription";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import {
  createWalletForRaffle,
  getInscriptionsTestnet,
  getUserBRC20Balance,
} from "@/lib/service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

// import useForm

type FormValues = {
  name: string;
  desc: string;
  price: number;
  sellingTicketLimit: number;
};

export default function CreateRaffle() {
  const queryClient = useQueryClient();
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
  const [selectBrc20, setSelectedBrc20] = useState<UserBrc20Type | null>(null);
  const paymentToken = "PSAT";
  const paymentAmount = 2000;

  const { data: userbrc20s, isLoading: brc20Loading } = useQuery({
    queryKey: ["userbrc20", connectedAddress],
    queryFn: () => {
      return getUserBRC20Balance(connectedAddress);
    },
    enabled: isConnected == true,
  });
  console.log(
    "🚀 ~ file: makeFeat.tsx:60 ~ CreateRaffle ~ userbrc20s:",
    userbrc20s,
  );

  useEffect(() => {
    if (userbrc20s && userbrc20s?.length !== 0) {
      const filteredArray = userbrc20s.filter(
        (item) => item.ticker === paymentToken && item.amount == paymentAmount,
      );
      setFilteredIns(filteredArray);
      setSelectedBrc20(filteredArray[0]);
    }
  }, [userbrc20s]);

  const toggleConfirmation = () => {
    setRaffleSubmitModal(!raffleSubmitModal);
  };

  const handleButtonClick = (status: boolean) => {
    setIsRaffleFeatured(status);
  };

  const waitOneSecond = (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("🚀 ~ file: index.tsx:135 ~ onSubmit ~ data:", data);
    setSubmitLoading(true);
    const { name, desc, price } = data;
    if (!name || !desc || !price || !chosenInscription || !chosenCurrency) {
      setSubmitLoading(false);
      toast.error("Please fill all the fields");
      return;
    }
    const walletResponse = await createWalletForRaffle();
    const walletInfo = walletResponse?.data;
    if (walletResponse) {
      console.log(
        "🚀 ~ file: index.tsx:121 ~ handleSubmit ~ walletInfo:",
        walletResponse,
      );
      const newRaffleData = {
        name: name,
        description: desc,
        price: parseFloat(price.toString()),
        sellingTokenTicker: chosenCurrency.title,
        sellingTokenImage: chosenCurrency.imagePath,
        featured: isRaffleFeatured,

        startDate: new Date().toISOString(),
        inscriptionId: `${chosenInscription.inscriptionId}`,
        inscriptionNumber: String(chosenInscription.inscriptionNumber),
        inscriptionPreviewUrl: `https://testnet.ordinals.com/content/${chosenInscription.inscriptionId}`,
        ownerId: connectedAddress,
        nftDepositAddress: walletInfo.nftDepositAddress,
        nftPrivateKey: walletInfo.nftPrivateKey,
        ticketDepositAddress: walletInfo.ticketDepositAddress,
        ticketPrivateKey: walletInfo.ticketPrivateKey,
        id: null,
        winnerId: null,
        featuredTransanctionId: null,
        nftDepositTransactionId: null,
        createdAt: null,
        sellingTicketLimit: 999,
        status: null,
        featuredTransaction: null, // Add appropriate value for featuredTransaction
        nftTransaction: null, // Add appropriate value for nftTransaction
        winner: null, // Add appropriate value for winner
        tickets: null, // Add appropriate value for tickets
        ticket_count: null,
      };
      setNewRaffleData(newRaffleData);
      await waitOneSecond();
      setRaffleSubmitModal(true);
      setSubmitLoading(false);
    }
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
        paymentToken,
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
        <div className="flex flex-col w-full col-span-6 col-start-4 gap-6 px-6 pt-5 pb-6 bg-neutral500 rounded-xl">
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
                  <div className="flex items-center justify-end text">
                    You don’t have proper inscription.
                  </div>
                  <div>
                    <Button className="" variant={"primary"}>
                      Inscribe now
                    </Button>
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
      </div>
    </Layout>
  );
}
