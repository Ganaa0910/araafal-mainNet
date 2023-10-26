import { Ticket } from "@/lib/types/dbTypes";
import moment from "moment";
import { useEffect, useState } from "react";

export default function Leaderboard({
  tokens,
  getAddressDetail,
  tickets,
}: {
  tickets: Ticket[];
}) {
  console.log("🚀 ~ file: Leaderboard.tsx:19 ~ tickets:", tickets);
  const [lastUpdated, setLastUpdated] = useState(moment());
  const [timeDifference, setTimeDifference] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(-1);
  const [searchWallet, setSearchWallet] = useState("");

  const [state, setState] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = moment();
      const diff = currentTime.diff(lastUpdated);
      const duration = moment.duration(diff);
      const hours = duration.hours().toString().padStart(2, "0");
      const minutes = duration.minutes().toString().padStart(2, "0");
      const seconds = duration.seconds().toString().padStart(2, "0");
      const formattedDiff = `${hours}H:${minutes}M:${seconds}S ago`;
      setTimeDifference(formattedDiff);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [lastUpdated]);

  const handleLeaderboardWalletClick = (address, index) => {
    navigator.clipboard.writeText(address);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(-1);
    }, 3000);
  };

  function handleChange(e) {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  const handleSearch = () => {
    if (state.searchWallet === undefined) return;
    setSearchWallet(state.searchWallet);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRefreshButtonClick = () => {
    getAddressDetail();
    setLastUpdated(moment());
  };

  // // Group transactions by transactionId and count them
  // const groupedTransactions: Record<
  //   string,
  //   { ticket: TransactionWithTicket[]; count: number }
  // > = tickets?.reduce((grouped, ticket) => {
  //   const transactionId = ticket.Transaction?.transactionId;
  //   if (!grouped[transactionId]) {
  //     grouped[transactionId] = {
  //       transactions: [],
  //       count: 0,
  //     };
  //   }
  //   grouped[transactionId].transactions.push(ticket);
  //   grouped[transactionId].count++;
  //   return grouped;
  // }, {});

  // // Sort the grouped transactions by transactionId
  // const sortedTransactionIds = Object.keys(groupedTransactions).sort();

  return (
    <>
      <div className="rounded-xl flex flex-col gap-[24px] p-[24px] border-2 border-primaryBrand raffle-gradient">
        <h1 className="text-3xl">Participants</h1>

        <div className="flex flex-col md:flex-row gap-4 relative">
          <input
            type="text"
            name="searchWallet"
            className="pl-3 grow rounded-md h-12 bg-primaryBrand border   focus:outline-none  "
            placeholder="Search"
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
          <div className="absolute right-4 top-4 text-lightGray">
            <button
              className="text-base bg-defaultGray border-lightGray px-[16px] py-[12px] h-[48px] w-full md:w-auto hover:bg-darkerLightGray hover:border-lightGray absolute left-0 top-0"
              onClick={handleSearch}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M15.5 10.5a5 5 0 11-10 0 5 5 0 0110 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="border border-primaryBrand flex flex-col divide-y-2 divide-primaryBrand  rounded-lg">
          <div className="flex justify-between px-6 py-4 text-lg bg-red">
            <h5>Wallet</h5>
            <h5>Tickets</h5>
          </div>
          <div className="h-[270px] w-full overflow-y-auto">
            {tickets?.length > 0 &&
              tickets
                .filter((token) =>
                  token.userId
                    .toLowerCase()
                    .includes(searchWallet.toLowerCase()),
                )
                .map((token, key) => (
                  <li
                    className="px-6 py-1 flex justify-between text-lg bg-darkGray border border-x-0 border-t-0 border-lightGray "
                    key={key}
                  >
                    <a
                      className="cursor-pointer text-lighterGray hover:text-gray-400"
                      onClick={() =>
                        handleLeaderboardWalletClick(token.userId, key)
                      }
                    >
                      {token.userId.substring(0, 4) +
                        "..." +
                        token.userId.substring(token.userId.length - 4)}
                    </a>
                    {/* <p>{token.ticket}1</p> */}
                    {copiedIndex === key && (
                      <div className="absolute top-2 right-2">
                        <div className="alert alert-success">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current shrink-0 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>Address Copied!</span>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
          </div>
        </div>
      </div>
    </>
  );
}
