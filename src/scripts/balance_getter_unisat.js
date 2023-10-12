const mempoolJS = require("@mempool/mempool.js");
const axios = require("axios");
const he = require("he");
require("dotenv").config();

const apiKey = process.env.UNISAT_API_KEY;
const apiUrl = "https://open-api.unisat.io";

async function main() {
  const address =
    "bc1pxwx69grfcccaphd6xa0fmrz3pqthftatmzvwa807r450j7n29mpqsmd28p";
  const balance = await getBRC20s(address);
  console.log(balance);
}

//TODO: transfer hiigdsen esehiig shalgah. indexertei zereh hiigdene
async function getBRC20s(address) {
  let inscriptions = [];
  try {
    const response = await axios.get(
      `${apiUrl}/v1/indexer/address/${address}/inscription-utxo-data`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );
    const utxos = response.data.data.utxo;
    inscriptions = await processUtxos(utxos);
  } catch (error) {
    console.log(error);
  }
  return inscriptions;
}

const processUtxos = async (utxos) => {
  const inscriptions = await Promise.all(
    utxos.flatMap(async (utxo) => {
      if (
        utxo.inscriptions &&
        utxo.inscriptions[0] !== undefined &&
        utxo.inscriptions[0] !== null &&
        utxo.inscriptions[0].isBRC20
      ) {
        try {
          const brc20Info = await processBRC20(
            utxo.inscriptions[0].inscriptionId,
          );
          const mergedInscriptionInfo = {
            ...utxo.inscriptions[0],
            ...brc20Info,
          };
          return mergedInscriptionInfo;
        } catch (error) {
          // Handle errors from processBRC20 function
          console.error("Error processing BRC20:", error);
        }
      }
      return null; // Return null for invalid or unprocessable inscriptions
    }),
  );

  // Filter out null values (failed processing) and return the resulting array
  return inscriptions.filter((inscription) => inscription !== null);
};

async function processBRC20(inscriptionId) {
  try {
    const response = await axios.get(
      `https://ordinals.com/preview/${inscriptionId}`,
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
        const brc20Info = {
          amount: jsonData.amt,
          ticker: jsonData.tick,
          operation: jsonData.op,
          price: jsonData.p,
        };
        return brc20Info;
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Handle 404 error if needed
    } else {
      console.error(`Error processing inscription ${inscriptionId}:`, error);
    }
  }
}

// response data deer brc20 info irehgui baigaa, unisat problem
async function getBRC20info(inscriptionId) {
  let brc20 = [];
  try {
    const response = await axios.get(
      `${apiUrl}/v1/indexer/inscription/info/${inscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );
    console.log(response);
    // const inscriptionInfo = response.data.data;
  } catch (error) {}
  return brc20;
}

main().catch(console.error);
