import { TicketsByRaffle } from "@/lib/types";
import { Raffle, Ticket } from "@/lib/types/dbTypes";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Image from "next/image";
interface State {
  searchWallet?: string;
  // add other state properties as needed
}

export default function Leaderboard({
  raffleDetail,
  tickets,
}: {
  raffleDetail: Raffle | undefined;
  tickets: { rows: TicketsByRaffle[] };
}) {
  const [searchWallet, setSearchWallet] = useState("");

  const [state, setState] = useState<State>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    setState({ ...state, [target.name]: target.value });
  }

  const handleSearch = () => {
    if (state.searchWallet === undefined) return;
    setSearchWallet(state.searchWallet);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
          <div className="h-[270px] w-full overflow-y-auto bg-brandBlack ">
            {tickets?.rows.length > 0 &&
              tickets?.rows
                .filter((token) =>
                  token.userId
                    .toLowerCase()
                    .includes(searchWallet.toLowerCase()),
                )
                .map((token, key) => (
                  <li
                    className={`flex justify-between px-5 py-3 text-lg border border-t-0 border-x-0 border-brand ${
                      raffleDetail?.winnerId == token.userId &&
                      "primary-gradient"
                    }`}
                    key={key}
                  >
                    <a
                      className="cursor-pointer text-whiteish hover:text-gray-400"
                      // onClick={() =>
                      //   handleLeaderboardWalletClick(token.userId, key)
                      // }
                    >
                      {token.userId.substring(0, 4) +
                        "..." +
                        token.userId.substring(token.userId.length - 4)}
                    </a>
                    <div className="flex gap-2">
                      {token.ticketCount}
                      <div className="flex items-center justify-center w-5 h-5">
                        {raffleDetail?.winnerId == token.userId ? (
                          <Image
                            alt="ticket"
                            src={"/images/medal.svg"}
                            width={24}
                            height={24}
                            className="w-full h-full"
                          />
                        ) : (
                          <Image
                            alt="ticket"
                            src={"/ticket.svg"}
                            width={24}
                            height={24}
                            className="w-full h-full"
                          />
                        )}
                      </div>
                    </div>
                  </li>
                ))}
          </div>
        </div>
      </div>
    </>
  );
}
