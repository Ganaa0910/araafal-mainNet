const mempoolJS = require("@mempool/mempool.js");
const axios = require("axios");
const he = require("he");
require("dotenv").config();

async function main() {
  const address =
    "tb1pk4dzxehzkcmqk3c685gukuhjamvcs690tdlemrcrvttjy273gqmsrh2us5";
  const balance = await getOrdinals(address);
  console.log(balance);
}

async function getInscriptions(address) {
  try {
    let inscriptions = [];
    const {
      bitcoin: { addresses },
    } = mempoolJS({
      hostname: "mempool.space",
      network: "testnet",
    });

    const transactions = await addresses.getAddressTxsUtxo({ address });
    for (let i = 0; i < transactions.length; i++) {
      try {
        const response = await axios.get(
          `https://testnet.ordinals.com/preview/${transactions[i].txid}i0`,
        );
        if (response.status === 200) {
          inscriptions.push(transactions[i].txid);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
        } else {
          console.error(
            `Error processing transaction ${transactions[i].txid}:`,
            error,
          );
        }
      }
    }
    return inscriptions;
  } catch (error) {}
}

async function getOrdinals(address) {
  try {
    let ordinals = [];
    const {
      bitcoin: { addresses },
    } = mempoolJS({
      hostname: "mempool.space",
      network: "testnet",
    });

    const transactions = await addresses.getAddressTxsUtxo({ address });
    for (let i = 0; i < transactions.length; i++) {
      try {
        const response = await axios.get(
          `https://testnet.ordinals.com/preview/${transactions[i].txid}i0`,
        );
        if (response.status === 200) {
          const htmlResponse = response.data;
          const inscriptionIdStartIndex =
            htmlResponse.lastIndexOf("<img src=/content/");
          const inscriptionIdEndIndex = htmlResponse.lastIndexOf("></img>\n");
          const inscriptionId = htmlResponse.substring(
            inscriptionIdStartIndex,
            inscriptionIdEndIndex + 1,
          );

          if (inscriptionId) {
            ordinals.push(transactions[i].txid);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
        } else {
          console.error(
            `Error processing transaction ${transactions[i].txid}:`,
            error,
          );
        }
      }
    }
    return ordinals;
  } catch (error) {}
}

async function getBRC20s(address) {
  try {
    let brc20s = [];
    const {
      bitcoin: { addresses },
    } = mempoolJS({
      hostname: "mempool.space",
      network: "testnet",
    });

    const transactions = await addresses.getAddressTxsUtxo({ address });
    for (let i = 0; i < transactions.length; i++) {
      try {
        const response = await axios.get(
          `https://testnet.ordinals.com/preview/${transactions[i].txid}i0`,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          },
        );
        if (response.status === 200) {
          const htmlResponse = response.data;
          const jsonStartIndex = htmlResponse.lastIndexOf("{");
          const jsonEndIndex = htmlResponse.lastIndexOf("}");
          const jsonString = htmlResponse.substring(
            jsonStartIndex,
            jsonEndIndex + 1,
          );
          const decodedJsonString = he.decode(jsonString);
          const jsonData = JSON.parse(decodedJsonString);

          if (jsonData.p && jsonData.op && jsonData.tick && jsonData.amt) {
            brc20s.push(transactions[i].txid);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
        } else {
          console.error(
            `Error processing transaction ${transactions[i].txid}:`,
            error,
          );
        }
      }
    }
    return brc20s;
  } catch (error) {}
}

main().catch(console.error);
