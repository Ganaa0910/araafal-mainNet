import PageTitle from "@/components/atom/page-title";
import Choose from "@/components/create-raffle/choose";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { createRaffle, getInscriptionsTestnet } from "@/lib/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useSelector } from "react-redux";

export default function CreateRaffle() {
  const queryClient = useQueryClient();
  const account = useSelector((state) => state.account);
  const [showInscriptions, setShowInscriptions] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [combinedDateTime, setCombinedDateTime] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [chosenInscription, setChosenInscription] = useState({});
  const [success, setSuccess] = useState(false);

  const [walletInfo, setWalletInfo] = useState({});

  const { data, error, isLoading, mutateAsync } = useMutation({
    mutationFn: createRaffle,
    onError: () => {
      console.log(error);
    },
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const toggleInscriptions = () => {
    setShowInscriptions(!showInscriptions);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const getCombinedDateTime = (date, time) => {
    const combinedDateTimeString = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}T${time.getHours()}:${time.getMinutes()}:00Z`;
    return combinedDateTimeString;
  };

  const { data: inscriptions } = useQuery({
    queryKey: ["inscriptions", account],
    queryFn: () => {
      return getInscriptionsTestnet(account.address);
    },
    enabled: account.connected == true,
  });
  console.log(
    "🚀 ~ file: index.tsx:57 ~ CreateRaffle ~ inscriptions:",
    inscriptions,
  );

  const [activeButton, setActiveButton] = useState("default");

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an API request or fetch data from a source
        const response = await fetch(
          "http://localhost:3001/api/raffles/generateWallet",
          {
            method: "POST",
          },
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // const ins = getBalance;

        // Update the state with the fetched data
        setWalletInfo(data);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // setLoading(false);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);

  const handleSubmit = async () => {
    let txid = await window.unisat.sendInscription(
      walletInfo.nftDepositAddress,
      `${chosenInscription.inscriptionId}`,
    );
    if (txid) {
      console.log("🚀 ~ file: index.tsx:109 ~ handleSubmit ~ txid:", txid);
      const newRaffleData = {
        name: name,
        description: desc,
        price: parseFloat(price),
        sellingTokenTicker: "BTC",
        featured: false,
        endDate: getCombinedDateTime(selectedDate, selectedTime),
        startDate: new Date().toISOString(),
        inscriptionId: `${chosenInscription.inscriptionId}`,
        inscriptionPreviewUrl: `https://testnet.ordinals.com/content/${chosenInscription.inscriptionId}`,
        ownerId: account.address,
        nftDepositTransactionId: txid,

        nftDepositAddress: walletInfo.nftDepositAddress,
        nftPrivateKey: walletInfo.nftPrivateKey,
        ticketDepositAddress: walletInfo.ticketDepositAddress,
        ticketPrivateKey: walletInfo.ticketPrivateKey,
      };
      await mutateAsync({ newRaffleData });
    }
  };

  return (
    <Layout>
      <Choose
        show={showInscriptions}
        handleClose={toggleInscriptions}
        inscriptions={inscriptions}
        setChosenInscription={setChosenInscription}
        chosenInscription={chosenInscription}
      />
      <PageTitle name="Create Raffle" />
      <div className="w-full h-[544px] flex flex-row gap-8 mb-52">
        {chosenInscription ? (
          <>
            <div
              className="flex flex-col items-center justify-center w-1/3 border-2 h-5/6 border-lightGray rounded-xl overflow-hidden"
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
          </>
        ) : (
          <div
            className="flex flex-col items-center justify-center w-1/3 border-2 h-[464px] border-brand rounded-xl primary-gradient"
            onClick={toggleInscriptions}
          >
            <Image src={"/nft.svg"} width={96} height={96} />
            <h1 className="text-2xl text-center text-whiteish">
              Click here to <br /> choose inscription
            </h1>
          </div>
        )}
        <div className="flex flex-row w-2/3 h-full gap-8">
          <div className="flex flex-col w-2/3 gap-8 h-5/6">
            <div className="flex flex-col w-full px-6 pt-5 pb-6 border-2 h-[144px] border-brand rounded-xl raffle-gradient">
              <h1 className="text-2xl font-bolds">Ticket price</h1>
              <div className="flex flex-row justify-between w-full mt-auto mb-0 h-1/2">
                <div className="flex flex-row items-center justify-center gap-4">
                  <Image
                    src="/bitcoin.svg"
                    alt="Your Image"
                    width={32}
                    height={32}
                    className="w-10 h-10"
                  />
                  <h2 className="text-2xl font-bold">BTC</h2>
                </div>
                <div className="ml-4">
                  <input
                    type="text"
                    placeholder="Enter an amount"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="px-6 py-3  bg-brandBlack focus:outline-none hover:border hover:border-brand rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full gap-4 pt-5 pb-6 px-6 border-2 h-[388px] border-brand raffle-gradient rounded-xl">
              {/* <h1 className="text-2xl">Name</h1>
              <input
                className="w-full h-full bg-transparent border-2 rounded-xl"
                value={name}
                onChange={(e) => setName(e.target.value)}
              /> */}
              <h1 className="text-2xl">Description</h1>
              <textarea
                className="w-full h-full bg-brandBlack focus:outline-none hover:border hover:border-brand rounded-xl px-5 py-3 text-xl font-medium"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
          </div>
          {/* ________________________________________________________________________________________________________________________ */}
          <div className="flex flex-col w-[320px] h-full justify-between">
            <div className="w-full border-2 h-[216px] border-brand raffle-gradient rounded-xl px-6 pt-5 pb-6 flex flex-col gap-5">
              <h1 className="font-bold text-2xl flex flex-row justify-between">
                Make it Featured
                <Image src={"/icon.svg"} width={28} height={28} alt="icon" />
              </h1>
              <h1 className="font-bold text-2xl text-whiteish flex flex-row gap-3">
                <Image src={"/psat.svg"} width={36} height={36} alt="psat" />
                500 PSAT
              </h1>

              <div className="flex flex-row w-full bg-brandBlack border-2 border-brand rounded-xl">
                <button
                  className={`w-1/2 px-5 py-4 rounded-lg   ${
                    activeButton === "default" ? "bg-brand" : ""
                  }`}
                  onClick={() => handleButtonClick("default")}
                >
                  Default
                </button>
                <button
                  className={`w-1/2 px-5 py-4 rounded-lg ${
                    activeButton === "featured" ? "bg-brand" : ""
                  }`}
                  onClick={() => handleButtonClick("featured")}
                >
                  Featured
                </button>
              </div>
            </div>
            <div className="w-full border-2 h-[216px] border-brand raffle-gradient rounded-xl flex flex-col gap-4 px-6 pb-6 pt-5">
              <h1 className="text-xl">End Date</h1>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="w-full px-4 py-3 rounded-lg bg-brandBlack text-xl text-whiteish"
                placeholderText="Pick a date"
              />
              <DatePicker
                selected={selectedDate}
                onChange={handleTimeChange}
                dateFormat="hh:mm"
                className="w-full px-4 py-3 rounded-lg bg-brandBlack text-xl text-whiteish"
                placeholderText="Pick a time"
              />
            </div>

            <div className="w-full">
              {/* <button
                className={`text-base w-full h-full bg-defaultGray border-lightGray px-[16px] py-[12px] h-[48px] hover:border-white`}
                onClick={() => handleSubmit()}
              >
                Submit
              </button> */}
              <Button variant={"primary"} className="w-full">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
      {success && (
        <div className="text-xl font-bold text-center text-green-500">
          Success!
        </div>
      )}
    </Layout>
  );
}
