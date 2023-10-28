const axios = require("axios");
const he = require("he");
require("dotenv").config();

const apiKey = process.env.UNISAT_API_KEY;
const apiUrl = "https://open-api-testnet.unisat.io";

async function main() {
  // const address = "tb1qe8h5ensyqt04m64a5wwf60xy3dp0fta5dguwzy"; // BRC20
  const address =
    "tb1pk4dzxehzkcmqk3c685gukuhjamvcs690tdlemrcrvttjy273gqmsrh2us5"; // Ordinal
  const balance = await getBRC20s(address);
  console.log(balance);
}

async function getOrdinals(address) {
  let inscriptions = [];
  const utxoLength = await getUTXOLength(address);
  try {
    const response = await axios.get(
      `${apiUrl}/v1/indexer/address/${address}/inscription-utxo-data/?size=${utxoLength}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );
    const utxos = response.data.data.utxo;
    inscriptions = await processOrdinalsUtxos(utxos);
  } catch (error) {
    console.log(error);
  }
  return inscriptions;
}

const processOrdinalsUtxos = async (utxos) => {
  const inscriptions = await Promise.all(
    utxos.flatMap(async (utxo) => {
      if (
        utxo.inscriptions &&
        utxo.inscriptions[0] !== undefined &&
        utxo.inscriptions[0] !== null &&
        utxo.inscriptions[0].isBRC20 === false
      ) {
        try {
          const isOrdinal = await processOrdinal(
            utxo.inscriptions[0].inscriptionId,
          );
          const mergedInscriptionInfo = {
            ...utxo.inscriptions[0],
            ...isOrdinal,
          };
          return mergedInscriptionInfo;
        } catch (error) {
          // Handle errors from processOrdinal function
          console.error("Error processing Ordinal:", error);
        }
      }
      return null; // Return null for invalid or unprocessable inscriptions
    }),
  );

  return inscriptions.filter((inscription) => inscription !== null);
};

async function processOrdinal(inscriptionId) {
  try {
    const response = await axios.get(
      `https://testnet.ordinals.com/inscription/${inscriptionId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
    if (response.status === 200) {
      const htmlResponse = response.data;
      const isOrdinal = htmlResponse.lastIndexOf("<dd>image");
      return { isOrdinal: isOrdinal !== -1 };
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Handle 404 error if needed
    } else {
      console.error(`Error processing inscription ${inscriptionId}:`, error);
    }
  }
}

async function getBRC20s(address) {
  const transactions = await getBRC20transactions(address);
  let inscriptions = [];
  const finalBalance = transactions.reduce((acc, cur) => {
    acc[cur.ticker] = acc[cur.ticker] || { balance: 0, transferable: 0 };
    if (cur.operation === "mint") {
      acc[cur.ticker].balance += parseFloat(cur.amount);
    } else if (cur.operation === "transfer") {
      if (cur.sequence === 0 && cur.moved === true) {
        acc[cur.ticker].balance -= parseFloat(cur.amount);
      } else if (cur.sequence === 0 && cur.moved === false) {
        inscriptions.push(cur);
        acc[cur.ticker].transferable += parseFloat(cur.amount);
      } else if (cur.sequence === 1) {
        acc[cur.ticker].balance += parseFloat(cur.amount);
      }
    }
    return acc;
  }, {});
  return inscriptions;
}

async function getBRC20transactions(address) {
  let inscriptions = [];
  const utxoLength = await getUTXOLength(address);
  try {
    const response = await axios.get(
      `${apiUrl}/v1/indexer/address/${address}/inscription-utxo-data/?size=${utxoLength}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );
    const utxos = response.data.data.utxo;
    inscriptions = await processBRC20Utxos(utxos);
  } catch (error) {
    console.log(error);
  }
  return inscriptions;
}

const processBRC20Utxos = async (utxos) => {
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
      `https://testnet.ordinals.com/preview/${inscriptionId}`,
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
          type: jsonData.p,
        };
        return brc20Info;
      } else if (
        jsonData.p &&
        jsonData.op &&
        jsonData.tick &&
        jsonData.max &&
        jsonData.lim
      ) {
        const brc20Info = {
          max: jsonData.max,
          limit: jsonData.lim,
          ticker: jsonData.tick,
          operation: jsonData.op,
          type: jsonData.p,
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

async function getUTXOLength(address) {
  let length = 0;
  try {
    const response = await axios.get(
      `${apiUrl}/v1/indexer/address/${address}/inscription-utxo-data`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );
    length = response.data.data.totalConfirmed;
  } catch (error) {
    console.log(error);
  }
  return length;
}

main().catch(console.error);
