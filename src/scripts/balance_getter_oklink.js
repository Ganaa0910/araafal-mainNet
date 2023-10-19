const axios = require("axios");
const he = require("he");
require("dotenv").config();

async function main() {
  const address = "bc1q2uj0v7lsslw0t4qzmq78lnuhhdgjerkg8dvej3";

  const brc20Balance = await getInscriptions(address);
  console.log(brc20Balance);

  const transferableInscriptions = await getTransferableInscriptions(
    address,
    "sats",
  );
  console.log(transferableInscriptions);
}

async function getInscriptions(address) {
  try {
    let response = await axios({
      method: "get",
      headers: {
        "OK-ACCESS-KEY": process.env.OKLINK_API_KEY,
      },
      url: `https://www.oklink.com/api/v5/explorer/btc/address-balance-list?address=${address}`,
    });

    if (response.data.msg == "") {
      let inscriptionDatas = response.data.data;
      let result = [];

      if (inscriptionDatas.length == 0) return;
      for (let i = 0; i < inscriptionDatas.length; i++) {
        for (let j = 0; j < parseInt(inscriptionDatas[i].totalPage); j++) {
          for (let k = 0; k < inscriptionDatas[i].balanceList.length; k++) {
            {
              result.push({
                name: inscriptionDatas[i].balanceList[k].token,
                availableBalance:
                  inscriptionDatas[i].balanceList[k].availableBalance,
                transferBalance:
                  inscriptionDatas[i].balanceList[k].transferBalance,
                balance: inscriptionDatas[i].balanceList[k].balance,
              });
            }
          }
        }
      }
      return result;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getTransferableInscriptions(address, ticker) {
  try {
    let result = [];
    const response = await axios({
      method: "get",
      params: {
        address: address,
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
          inscriptionId: balanceDetails[i].transferBalanceList[j].inscriptionId,
          inscriptionNumber:
            balanceDetails[i].transferBalanceList[j].inscriptionNumber,
        });
      }
    }
    return result;
  } catch (e) {
    console.log(e);
  }
}

async function transferInscription(toAddress, inscriptionId) {
  try {
    let txid = await window.unisat.sendInscription(toAddress, inscriptionId);
    return txid;
  } catch (error) {
    console.log(error);
  }
}

async function inscribeTransfer(ticker, amount) {
  try {
    const tx = await window.unisat.inscribeTransfer(ticker, amount);
    return tx;
  } catch (error) {
    console.log(error);
  }
}

main().catch(console.error);
