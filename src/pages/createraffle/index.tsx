import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Choose from "@/components/create-raffle/choose";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRaffle, getInscriptionsTestnet } from "@/lib/fetcherFunctions";
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
  const [chosenInscription, setChosenInscrption] = useState("");
  console.log(
    "🚀 ~ file: index.tsx:22 ~ CreateRaffle ~ chosenInscription:",
    chosenInscription,
  );
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
    // updateCombinedDateTime(selectedDate, time);
  };

  // const updateCombinedDateTime = (date, time) => {
  //   const formattedDate = date.toISOString().split("T")[0];
  //   const combinedDateTimeString = `${formattedDate}T${time}:00Z`;
  //   setCombinedDateTime(combinedDateTimeString);
  // };

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
      `${chosenInscription}i0`,
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
        startDate: "2023-09-27T00:00:00Z",
        inscriptionId: `${chosenInscription}i0`,
        inscriptionPreviewUrl: `https://testnet.ordinals.com/content/${chosenInscription}i0`,
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
    <div className="max-w-[1216px] mx-auto h-auto flex flex-col">
      <Choose
        show={showInscriptions}
        handleClose={toggleInscriptions}
        inscriptions={inscriptions}
        setChosenInscrption={setChosenInscrption}
        chosenInscription={chosenInscription}
      />
      <div className="">Create Raffle</div>
      <div className="w-full h-[544px] flex flex-row gap-8">
        {chosenInscription ? (
          <div
            className="w-1/3 flex flex-col justify-center items-center h-5/6 border-2 border-lightGray rounded-xl"
            onClick={toggleInscriptions}
          >
            <Image
              className="w-full  rounded-md"
              src={`https://testnet.ordinals.com/content/${chosenInscription}i0`}
              alt="Card"
              height={100}
              width={100}
            />
          </div>
        ) : (
          <div
            className="w-1/3 flex flex-col justify-center items-center h-5/6 border-2 border-lightGray rounded-xl"
            onClick={toggleInscriptions}
          >
            <Image src={"/nft.svg"} width={96} height={96} />
            <h1 className=" text-2xl text-center">
              Click here to <br /> choose inscription
            </h1>
          </div>
        )}
        <div className="w-2/3 h-full  flex flex-row gap-8">
          <div className="w-2/3 h-5/6 flex flex-col gap-8">
            <div className="w-full h-1/3 border-2 border-lightGray rounded-xl flex flex-col p-4">
              <h1>Ticket price</h1>
              <div className="flex flex-row w-full h-1/2 mb-0 mt-auto justify-between">
                <div className="flex flex-row items-center justify-center gap-4">
                  <Image
                    src="/bitcoin.svg"
                    alt="Your Image"
                    width={32}
                    height={32}
                    className="w-10 h-10"
                  />
                  <h2 className="font-bold text-xl">BTC</h2>
                </div>
                <div className="ml-4">
                  <input
                    type="text"
                    placeholder="Enter an amount"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 mt-2 bg-black"
                  />
                </div>
              </div>
            </div>
            <div className="w-full h-2/3  flex flex-col p-10 border-2 border-lightGray rounded-xl gap-4">
              <h1 className="text-2xl">Name</h1>
              <input
                className="w-full h-full bg-transparent border-2 rounded-xl"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <h1 className="text-2xl">Description</h1>
              <input
                className="w-full h-full bg-transparent border-2 rounded-xl"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
          </div>
          <div className="w-1/3 h-full flex flex-col gap-8">
            <div className="w-full h-2/5 border-2 border-lightGray rounded-xl">
              <div className="flex flex-col justify-between gap-4 items-center">
                <h1 className="text-xl mt-8">End Date</h1>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="border p-2 rounded w-full"
                />
                {/* <DatePicker
                  selected={selectedDate}
                  onChange={handleTimeChange}
                  format="hh:mm"
                  className="border p-2 rounded w-full"
                /> */}
              </div>
            </div>
            <div className="w-full h-1/8 ">
              <button
                className={`text-base w-full h-full bg-defaultGray border-lightGray px-[16px] py-[12px] h-[48px] hover:border-white`}
                onClick={() => handleSubmit()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {success && (
        <div className="text-center text-green-500 font-bold text-xl">
          Success!
        </div>
      )}
    </div>
  );
}