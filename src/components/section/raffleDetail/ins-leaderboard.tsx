import { Ticket } from "@/lib/types/dbTypes";
import moment from "moment";
import { useEffect, useState } from "react";

export default function Leaderboard({
  tokens,

  tickets,
}: {
  tickets: Ticket[];
}) {
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
      <div className="rounded-xl flex flex-col gap-4  p-[24px] border-2 border-brand raffle-gradient font-bold h-[558px]">
        <h1 className="text-2xl">Participants</h1>

        <div className="relative flex flex-row gap-4">
          <input
            type="text"
            name="searchWallet"
            className="h-12 pl-3 text-xl font-medium rounded-md hover:border-brand hover:border-2 grow bg-brandBlack focus:outline-none"
            placeholder="Search"
            onChange={handleChange}
            onKeyPress={handleKeyPress}
          />
          <div className="absolute right-12 text-lightGray">
            <button
              className="text-base bg-defaultGray border-lightGray px-[16px] py-[12px] h-[48px] w-auto absolute left-0 top-0"
              onClick={handleSearch}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.031 16.617L22.314 20.899L20.899 22.314L16.617 18.031C15.0237 19.3082 13.042 20.0029 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20.0029 13.042 19.3082 15.0237 18.031 16.617ZM16.025 15.875C17.2941 14.5699 18.0029 12.8204 18 11C18 7.132 14.867 4 11 4C7.132 4 4 7.132 4 11C4 14.867 7.132 18 11 18C12.8204 18.0029 14.5699 17.2941 15.875 16.025L16.025 15.875Z"
                  fill="white"
                />
              </svg>

              {/* <Image alt="search" width={20} height={20} src={"/search.svg"} /> */}
            </button>
          </div>
        </div>

        <div className="flex flex-col border-2 divide-y-2 rounded-lg divide-brand border-brand ">
          <div className="flex justify-between px-6 py-4 text-lg bg-red">
            <h5>Wallet</h5>
            <h5>Tickets</h5>
          </div>
          <div className="h-[270px] w-full overflow-y-auto bg-brandBlack rounded">
            {tickets?.length > 0 &&
              tickets
                .filter((token) =>
                  token.userId
                    .toLowerCase()
                    .includes(searchWallet.toLowerCase()),
                )
                .map((token, key) => (
                  <li
                    className="flex justify-between px-6 py-1 text-lg border border-t-0 bg-darkGray border-x-0 border-lightGray "
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
                            className="w-6 h-6 stroke-current shrink-0"
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
