import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Image from "next/image";

import CloseImg from "../../public/close.svg";
import raffle from "../../raffleDetails.json";

import axios from "axios";
import { getUserBitcoinBalance } from "@/lib/service";
import { Raffle } from "@/lib/types/dbTypes";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { TransactionType, createTicket } from "@/lib/service";
import { Button } from "./ui/button";

const PurchaseOverlay = ({
  isOpen,
  onClose,
  raffleDetail,
}: {
  isOpen: Boolean;
  onClose: () => void;
  raffleDetail: Raffle;
}) => {
  const ticket = useSelector((state) => state.ticket);
  const queryClient = useQueryClient();
  const account = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [inscriptions, setInscriptions] = useState([]);
  const [success, setSuccess] = useState(false);

  const [inscriptionId, setInscriptionId] = useState("");
  const [selectedToken, setSelectedToken] = useState("");
  const [transferableInscriptions, setTransferableInscriptions] = useState([]);

  const [inscribeAmount, setInscribeAmount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      getBalance();
    }
  }, [isOpen]);

  async function getBalance() {
    let result = [];
    try {
      const response = await axios({
        method: "get",
        params: {
          address: account.address,
          // address: "16G1xYBbiNG78LSuZdMqp6tux5xvVp9Wxh",
          limit: 50,
        },
        headers: {
          "OK-ACCESS-KEY": process.env.OKLINK_API_KEY,
        },
        url: `https://www.oklink.com/api/v5/explorer/btc/address-balance-list`,
      });
      const balanceDatas = response.data.data;
      for (let i = 0; i < balanceDatas.length; i++) {
        for (let j = 0; j < parseInt(balanceDatas[i].totalPage); j++) {
          for (let k = 0; k < balanceDatas[i].balanceList.length; k++) {
            if (balanceDatas[i].balanceList[k].tokenType == "BRC20") {
              let token = balanceDatas[i].balanceList[k].token;
              let tokenExists = result.find((obj) => obj.token === token);
              if (tokenExists) {
                tokenExists.balance += parseInt(
                  balanceDatas[i].balanceList[k].balance,
                );
              } else {
                result.push({
                  token: token,
                  balance: parseInt(balanceDatas[i].balanceList[k].balance),
                  availableBalance: parseInt(
                    balanceDatas[i].balanceList[k].availableBalance,
                  ),
                  transferBalance: parseInt(
                    balanceDatas[i].balanceList[k].transferBalance,
                  ),
                });
              }
            }
          }
        }
      }
      setInscriptions(result);
    } catch (e) {
      console.log(e);
    }
  }

  const { data, error, isLoading, mutateAsync } = useMutation({
    mutationFn: createTicket,
    onError: () => {
      console.log(error);
    },
    onSuccess: () => {
      setSuccess(true);
      onClose();
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
  // console.log("🚀 ~ file: PurchaseOverlay.tsx:98 ~ data:", data);

  async function getTransferableInscriptions(ticker) {
    try {
      let result = [];
      const response = await axios({
        method: "get",
        params: {
          address: account.address,
          // address: "16G1xYBbiNG78LSuZdMqp6tux5xvVp9Wxh",
          limit: 50,
          token: ticker,
        },
        headers: {
          "OK-ACCESS-KEY": process.env.OKLINK_API_KEY,
        },
        url: `https://www.oklink.com/api/v5/explorer/btc/address-balance-details`,
      });
      const balanceDetails = response.data.data;
      for (let i = 0; i < balanceDetails.length; i++) {
        for (let j = 0; j < balanceDetails[i].transferBalanceList.length; j++) {
          result.push({
            amount: balanceDetails[i].transferBalanceList[j].amount,
            inscriptionId:
              balanceDetails[i].transferBalanceList[j].inscriptionId,
            inscriptionNumber:
              balanceDetails[i].transferBalanceList[j].inscriptionNumber,
          });
        }
      }
      setTransferableInscriptions(result);
    } catch (e) {
      console.log(e);
    }
  }

  function handleInscriptionClick(ticker) {
    setSelectedToken(ticker);
    getTransferableInscriptions(ticker);
  }

  function handleInscribeAmountChange(e) {
    setInscribeAmount(e.target.value);
  }

  async function handleTransferBitcoinButton() {
    try {
      const txid = await window.unisat.sendBitcoin(
        raffleDetail.ticketDepositAddress,
        parseInt((ticket?.amount * raffleDetail?.price * 100000000).toString()),
      );
      if (txid) {
        const variables: TransactionType = {
          transactionId: txid,
          ticketCount: ticket.amount,
          raffleId: raffleDetail.id,
          userId: account.address,
          transactionData: {
            transactionNonce: "1",
            transactionType: "TICKET_TRANSACTION",
            token_ticker: selectedToken,
          },
        };
        await mutateAsync({ newTicketData: variables });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleInscribeButtonClick() {
    try {
      const tx = await window.unisat.inscribeTransfer(
        raffleDetail.sellingTokenTicker,
        raffleDetail.price * ticket.amount,
      );
      setInscriptionId(tx.inscriptionId);
    } catch (error) {
      console.log(error);
    }
  }

  async function transferInscription(inscriptionId: string) {
    console.log(account);
    try {
      let txid = await window.unisat.sendInscription(
        raffleDetail.ticketDepositAddress,
        inscriptionId,
      );
      console.log(
        "🚀 ~ file: PurchaseOverlay.tsx:160 ~ transferInscription ~ txid:",
        txid,
      );
      if (txid) {
        const variables: TransactionType = {
          transactionId: txid,
          ticketCount: ticket.amount,
          raffleId: raffleDetail.id,
          userId: account.address,
          transactionData: {
            transactionNonce: "1",
            transactionType: "TICKET_TRANSACTION",
            token_ticker: selectedToken,
          },
        };
        await mutateAsync({ newTicketData: variables });
      }
      // console.log(txid);
    } catch (error) {
      console.log(error);
    }
  }

  const { data: bitcoinBalance } = useQuery({
    queryKey: ["userbitcoin", account],
    queryFn: () => {
      return getUserBitcoinBalance(account.address);
    },
    enabled: account.connected == true,
  });

  console.log(bitcoinBalance);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="z-10 p-4 border rounded-lg shadow-md bg-defaultGray border-lightGray">
        <div className="flex items-center justify-between select-none">
          <h2 className="mb-2 text-lg font-semibold">Balance:</h2>
          <Image
            src={CloseImg}
            className="ml-6 cursor-pointer"
            alt="Close icon"
            onClick={onClose}
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {inscriptions.map((item) => (
            <button
              key={item.inscriptionId}
              className="flex flex-col items-center"
              onClick={() => handleInscriptionClick(item.token)}
            >
              <div className="flex justify-start">
                <span>{item.token}</span>
              </div>
              <div className="flex justify-between text-sm text-lightGray">
                <span>Transferable: </span>
                <span>{item.transferBalance}</span>
              </div>
              <div className="flex justify-between text-sm text-lightGray">
                <span>Available: </span>
                <span>{item.availableBalance}</span>
              </div>
              <div className="w-full h-0.5 bg-lightGray"></div>
              <div className="flex justify-between text-sm text-lightGray">
                <span>Balance: </span>
                <span>{item.balance}</span>
              </div>
            </button>
          ))}
        </div>
        {selectedToken ? (
          <div className="w-[300px] pt-2 flex flex-col gap-2">
            <div className="flex justify-between">
              <div>Raffle name:</div>
              <div>{raffleDetail?.name}</div>
            </div>
            <div className="flex justify-between">
              <div>Ticket price:</div>
              <div>
                {raffleDetail?.price} {raffleDetail?.sellingTokenTicker}
              </div>
            </div>

            <div className="flex justify-between">
              <div>Total:</div>
              <div>
                {ticket?.amount * raffleDetail?.price}{" "}
                {raffleDetail?.sellingTokenTicker}
              </div>
            </div>
            <button
              className="flex flex-col items-center w-full"
              onClick={() => transferInscription(raffleDetail?.inscriptionId)}
            >
              Confirm
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            {raffleDetail.sellingTokenTicker == "BTC" ? (
              <div>
                <div>
                  <span>
                    Amount to transfer: {ticket?.amount * raffleDetail?.price}
                  </span>
                </div>
                {bitcoinBalance ? (
                  <div>
                    <span>Balance: {bitcoinBalance / 100000000}</span>
                    <Button onClick={handleTransferBitcoinButton}>
                      Transfer
                    </Button>
                  </div>
                ) : (
                  <div>
                    <span>Balance: 0</span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <span>Select a token to transfer</span>
                <Button onClick={handleInscribeButtonClick}>Inscribe</Button>
                <Button onClick={() => transferInscription(inscriptionId)}>
                  Transfer
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseOverlay;
