import PageTitle from "@/components/atom/page-title";
import Layout from "@/components/layout/layout";
import ChooseCurrency from "@/components/modal/choose-currency";
import ChooseInscription from "@/components/modal/choose-inscription";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { createWalletForRaffle, getInscriptionsTestnet } from "@/lib/service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import RaffleConfirmation from "@/components/modal/raffle-confirmation";
import { InscriptionType } from "@/lib/types";
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
  const { isConnected, connectedAddress, setConnectedAddress, setConnected } =
    useWalletStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  console.log("🚀 ~ file: index.tsx:31 ~ CreateRaffle ~ errors:", errors);

  const [showInscriptions, setShowInscriptions] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const [raffleSubmitModal, setRaffleSubmitModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

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

  const toggleInscriptions = () => {
    if (isConnected !== true) {
      return toast.error("Please connect your wallet");
    }
    setShowInscriptions(!showInscriptions);
  };

  const toggleCurrency = () => {
    setShowCurrency(!showCurrency);
  };

  const toggleConfirmation = () => {
    setRaffleSubmitModal(!raffleSubmitModal);
  };
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };
  const handleTimeChange = (time: Date) => {
    console.log("🚀 ~ file: index.tsx:70 ~ handleTimeChange ~ time:", time);
    setSelectedTime(time);
  };

  const getCombinedDateTimeUnix = (date: Date, time: Date) => {
    const combinedDateTime = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        time.getUTCHours(),
        time.getUTCMinutes(),
      ),
    );

    // Convert to UNIX timestamp in seconds
    const unixTimestamp = Math.floor(combinedDateTime.getTime());

    return unixTimestamp;
  };
  const getCombinedDateTime = (date: Date, time: Date) => {
    const combinedDateTime = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        time.getUTCHours(),
        time.getUTCMinutes(),
      ),
    );

    return combinedDateTime.toISOString();
  };

  useEffect(() => {
    let now = new Date();

    now.setUTCHours(now.getUTCHours() + 2);
    setSelectedTime(now);
  }, []);

  const { data: inscriptions } = useQuery({
    queryKey: ["inscriptions", connectedAddress],
    queryFn: () => {
      return getInscriptionsTestnet(connectedAddress);
    },
    enabled: isConnected == true,
  });

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
    const { name, desc, price, sellingTicketLimit } = data;
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
        endDate: getCombinedDateTime(selectedDate, selectedTime),
        endDateUnix: getCombinedDateTimeUnix(selectedDate, selectedTime),
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
        sellingTicketLimit: sellingTicketLimit,
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

  let currentDate = new Date();
  let minDate = new Date(currentDate.setDate(currentDate.getUTCHours() + 2));

  return (
    <Layout>
      {/* {inscriptions && account.connected == true && ( */}
      <ChooseInscription
        show={showInscriptions}
        handleClose={toggleInscriptions}
        inscriptions={inscriptions}
        setChosenInscription={setChosenInscription}
      />
      {/* )} */}
      <ChooseCurrency
        show={showCurrency}
        handleClose={toggleCurrency}
        tokens={tokens}
        setChosenCurrency={setChosenCurrency}
      />
      {newRaffleData && (
        <RaffleConfirmation
          show={raffleSubmitModal}
          handleClose={toggleConfirmation}
          newRaffleData={newRaffleData}
        />
      )}
      {/* <PageTitle name="Create Raffle" /> */}

      <RaffleStep step={1} />

      <div className="w-full h-[574px] grid grid-cols-12 gap-8 mb-52">
        {chosenInscription ? (
          <div
            className="flex flex-col items-center justify-center col-span-4 overflow-hidden border-2 h-5/6 border-lightGray rounded-xl border-brand"
            onClick={toggleInscriptions}
          >
            <Image
              className="w-full rounded-md"
              src={`https://testnet.ordinals.com/content/${chosenInscription.inscriptionId}`}
              alt="Card"
              height={100}
              width={100}
            />
            <div className="pt-3 pb-4 text-center">
              <div className="text-xl font-medium text-whiteish">
                ID. {chosenInscription.inscriptionId?.substring(0, 5)} ...
                {chosenInscription.inscriptionId?.substring(
                  chosenInscription.inscriptionId?.length - 5,
                  chosenInscription.inscriptionId?.length - 1,
                )}
              </div>
              <div className="text-2xl font-bold text-whiteish ">
                NO. {chosenInscription.inscriptionNumber}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center col-span-4 border-2 h-[464px] border-brand rounded-xl primary-gradient"
            onClick={toggleInscriptions}
          >
            <Image
              src={"/nft.svg"}
              width={96}
              height={96}
              alt="nft placeholder"
            />
            <h1 className="text-2xl text-center text-whiteish">
              Click here to <br /> choose inscription
            </h1>
          </div>
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-8 col-span-8 gap-8"
        >
          {/* <div className="flex flex-row w-2/3 h-full gap-8"> */}
          <div className="flex flex-col col-span-5 gap-8 h-5/6">
            <div className="flex flex-col w-full px-6 pt-5 pb-6 border-2 border-brand rounded-xl raffle-gradient">
              <h1 className="text-2xl font-bolds">Ticket price</h1>
              <div className="flex flex-row justify-between w-full mt-auto mb-0 h-1/2">
                <div
                  className="flex flex-row items-center justify-center gap-4"
                  onClick={() => setShowCurrency(true)}
                >
                  <Image
                    src={chosenCurrency.imagePath}
                    alt="Your Image"
                    width={32}
                    height={32}
                    className="w-10 h-10"
                  />
                  <h2 className="text-2xl font-bold">
                    {chosenCurrency ? chosenCurrency.title : "BTC"}
                  </h2>
                  <Icons.chevronDown className="w-6 h-6 " />
                </div>
                <div className="flex flex-col gap-1 ml-4">
                  <input
                    type="number"
                    // name="amount"
                    placeholder="Enter an amount"
                    // min="0.01"
                    // value={price}
                    // onChange={(e) => handleInputChange(e)}
                    className="px-6 py-3 rounded-lg bg-brandBlack focus:outline-none hover:border hover:border-brand"
                    {...register("price", {
                      required: { value: true, message: "Price is required" },
                      min: {
                        value: 0.01,
                        message: "Price need to be higher than 0.01",
                      },
                    })}
                  />
                  {errors.price && typeof errors.price.message === "string" ? (
                    <p className="mb-5 text-sm text-red-600">
                      {errors.price.message}
                    </p>
                  ) : (
                    <p className="mb-5 text-sm text-neutral200">
                      Input need to be higher than 0.01
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full gap-4 px-6 pt-5 pb-6 border-2 border-brand raffle-gradient rounded-xl">
              <h1 className="text-2xl">Name</h1>
              <div className="flex flex-col gap-1">
                <input
                  className="w-full px-5 py-3 text-xl font-medium bg-brandBlack focus:outline-none hover:border hover:border-brand rounded-xl"
                  {...register("name", {
                    required: { value: true, message: "Name is required" },
                    minLength: {
                      value: 3,
                      message: "Name need to be longer",
                    },
                  })}
                />
                {errors.name && typeof errors.name.message === "string" ? (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                ) : (
                  <p className="text-sm text-neutral200">
                    Please input at least 3 characters
                  </p>
                )}
              </div>
              <h1 className="text-2xl">Description</h1>
              <div className="flex flex-col gap-1">
                <textarea
                  className="w-full h-full px-5 py-3 text-xl font-medium bg-brandBlack focus:outline-none hover:border hover:border-brand rounded-xl"
                  {...register("desc", {
                    required: {
                      value: true,
                      message: "Description is required",
                    },
                    minLength: {
                      value: 3,
                      message: "Description need to be longer",
                    },
                  })}
                />
                {errors.desc && typeof errors.desc.message === "string" ? (
                  <p className="text-sm text-red-600">{errors.desc.message}</p>
                ) : (
                  <p className="text-sm text-neutral200">
                    Please input at least 3 characters
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* ________________________________________________________________________________________________________________________ */}
          <div className="flex flex-col h-full col-span-3 gap-8">
            <div className="flex flex-col w-full gap-5 px-6 pt-5 pb-6 border-2 border-brand raffle-gradient rounded-xl">
              <h1 className="flex flex-row justify-between text-2xl font-bold">
                Ticket supply
              </h1>
              <div className="flex flex-col gap-1">
                <input
                  className="w-full px-5 py-3 text-xl font-medium bg-brandBlack focus:outline-none hover:border hover:border-brand rounded-xl"
                  {...register("sellingTicketLimit", {
                    required: {
                      value: true,
                      message: "Tickey supply is required",
                    },
                    min: {
                      value: 10,
                      message: "Tickey supply need to higher than 10",
                    },
                    max: {
                      value: 999,
                      message: "Tickey supply need to below than 999",
                    },
                  })}
                />
                {errors.sellingTicketLimit &&
                typeof errors.sellingTicketLimit.message === "string" ? (
                  <p className="text-sm text-red-600">
                    {errors.sellingTicketLimit.message}
                  </p>
                ) : (
                  <p className="text-sm text-neutral200">
                    Tickey supply need to higher than 10
                  </p>
                )}
              </div>
            </div>
            <div className="w-full border-2 h-[256px] border-brand raffle-gradient rounded-xl flex flex-col gap-4 px-6 pb-6 pt-5">
              <h1 className="text-xl">End Date</h1>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="w-full px-4 py-3 text-xl rounded-lg bg-brandBlack text-whiteish active:border active:border-brand"
                placeholderText="Pick a date"
                minDate={new Date()}
                disabled
              />
              <DatePicker
                selected={selectedTime}
                onChange={handleTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="hh:mm"
                timeCaption="Time"
                className="w-full px-4 py-3 text-xl rounded-lg bg-brandBlack text-whiteish focus:border focus:border-brand"
                minDate={minDate}
                disabled
              />
              <div className="text-center">
                In testnet launch user can&apos;t choose end date
              </div>
            </div>

            <div className="w-full">
              {/* <button
                className={`text-base w-full h-full bg-defaultGray border-lightGray px-[16px] py-[12px] h-[48px] hover:border-white`}
                onClick={() => handleSubmit()}
              >
                Submit
              </button> */}
              <Button
                variant={"primary"}
                className="w-full"
                type="submit"
                // onClick={() => handleSubmit()}
                // disabled={submitLoading || isConnected == false}
              >
                {submitLoading && (
                  <Icons.spinner
                    className="w-4 h-4 mr-0 md:mr-2 animate-spin "
                    aria-hidden="true"
                  />
                )}
                Continue
              </Button>
              {/* <Button onClick={handleTestButtoon}>testast5sa</Button>
              <Button onClick={handleNotTestButtoon}>asdasd</Button> */}
            </div>
          </div>
          {/* </div> */}
        </form>
      </div>
    </Layout>
  );
}
