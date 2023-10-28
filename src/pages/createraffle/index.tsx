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
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  const updateCombinedDateTime = (date, time) => {
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
    // txid.wait();
    console.log("🚀 ~ file: index.tsx:109 ~ handleSubmit ~ txid:", txid);
    if (txid) {
      const newRaffleData = {
        name: name,
        description: desc,
        price: parseFloat(price),
        sellingTokenTicker: "BTC",
        featured: false,
        endDate: selectedDate,
        startDate: updateCombinedDateTime(selectedDate, selectedTime),
        inscriptionId: `${chosenInscription.inscriptionId}`,
        inscriptionPreviewUrl: `https://testnet.ordinals.com/content/${chosenInscription.inscriptionId}`,
        ownerId: account.address,
        nftDepositTransactiond: txid,

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
          <div
            className="flex flex-col items-center justify-center w-1/3 border-2 h-5/6 border-lightGray rounded-xl"
            onClick={toggleInscriptions}
          >
            <Image
              className="w-full rounded-md"
              src={`https://testnet.ordinals.com/content/${chosenInscription.inscriptionId}`}
              alt="Card"
              height={100}
              width={100}
            />
          </div>
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
          <div className="flex flex-col w-1/3 h-full gap-8">
            <div className="w-full border-2 h-2/5 border-lightGray rounded-xl">
              <div className="flex flex-col items-center justify-between gap-4">
                <h1 className="mt-8 text-xl">End Date</h1>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="w-full p-2 border rounded"
                />
                {/* <DatePicker
                  selected={selectedDate}
                  onChange={handleTimeChange}
                  format="hh:mm"
                  className="w-full p-2 border rounded"
                /> */}
              </div>
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
