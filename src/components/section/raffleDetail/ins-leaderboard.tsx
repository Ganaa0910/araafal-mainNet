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
      <div className="rounded-xl flex flex-col gap-4  p-[24px] bg-neutral-800 font-bold h-[558px]">
        <h1 className="text-2xl">Participants</h1>

        <div className="relative flex flex-row gap-4">
          <input
            type="text"
            name="searchWallet"
            className="h-12 pl-3 text-xl font-medium rounded-md hover:border-neutral-500 hover:border grow bg-brandBlack focus:outline-none"
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

        <div className="flex flex-col bg-neutral-700  divide-y-2 rounded-lg divide-neutral-500  ">
          <div className="flex justify-between px-6 py-4 text-lg bg-red">
            <h5>Wallet</h5>
            <h5>Tickets</h5>
          </div>
          <div className="h-full w-full overflow-y-auto bg-brandBlack ">
            {tickets?.rows.length > 0 &&
              tickets?.rows
                .filter((token) =>
                  token.userId
                    .toLowerCase()
                    .includes(searchWallet.toLowerCase()),
                )
                .map((token, key) => (
                  <li
                    className={`group flex justify-between px-5 py-3 font-light text-lg border-b-2 border-neutral-600 hover:border-neutral-500 ${raffleDetail?.winnerId == token.userId &&
                      "bg-brandBlack"
                      }`}
                    key={key}
                  >
                    <a
                      className="cursor-pointer group-hover:text-whiteish text-neutral-400"
                    // onClick={() =>
                    //   handleLeaderboardWalletClick(token.userId, key)
                    // }
                    >
                      {token.userId.substring(0, 4) +
                        "..." +
                        token.userId.substring(token.userId.length - 4)}
                    </a>
                    <div className="flex gap-2">
                      <p className="group-hover:text-whiteish font-bold text-neutral-400">{token.ticketCount}</p>
                      <div className="flex items-center justify-center w-5 h-5">
                        {raffleDetail?.winnerId == token.userId ? (
                          // <Image
                          //   alt="ticket"
                          //   src={"/images/medal.svg"}
                          //   width={24}
                          //   height={24}
                          //   className="w-full h-full"
                          // />
                          <svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="Group">
                              <path id="Vector" d="M6.99967 4.83352C8.76778 4.83352 10.4635 5.53589 11.7137 6.78614C12.964 8.03638 13.6663 9.73207 13.6663 11.5002C13.6663 13.2683 12.964 14.964 11.7137 16.2142C10.4635 17.4645 8.76778 18.1668 6.99967 18.1668C5.23156 18.1668 3.53587 17.4645 2.28563 16.2142C1.03539 14.964 0.333008 13.2683 0.333008 11.5002C0.333008 9.73207 1.03539 8.03638 2.28563 6.78614C3.53587 5.53589 5.23156 4.83352 6.99967 4.83352ZM6.99967 6.50018C5.67359 6.50018 4.40182 7.02697 3.46414 7.96465C2.52646 8.90233 1.99967 10.1741 1.99967 11.5002C1.99967 12.8263 2.52646 14.098 3.46414 15.0357C4.40182 15.9734 5.67359 16.5002 6.99967 16.5002C8.32576 16.5002 9.59753 15.9734 10.5352 15.0357C11.4729 14.098 11.9997 12.8263 11.9997 11.5002C11.9997 10.1741 11.4729 8.90233 10.5352 7.96465C9.59753 7.02697 8.32576 6.50018 6.99967 6.50018ZM6.99967 7.75018L8.10217 9.98352L10.5663 10.3418L8.78301 12.0793L9.20384 14.5343L6.99967 13.3752L4.79551 14.5335L5.21634 12.0793L3.43301 10.341L5.89717 9.98268L6.99967 7.75018ZM11.9997 0.666849V3.16685L10.8638 4.11518C9.92129 3.62067 8.89223 3.31254 7.83301 3.20768V0.666849H11.9997ZM6.16634 0.666016V3.20768C5.10746 3.31239 4.07869 3.62023 3.13634 4.11435L1.99967 3.16685V0.666849L6.16634 0.666016Z" fill="white" />
                            </g>
                          </svg>
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
