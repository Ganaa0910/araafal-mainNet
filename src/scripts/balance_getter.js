const mempoolJS = require('@mempool/mempool.js')
const axios = require('axios')
require('dotenv').config()

async function main() {
  const address =
    'tb1pk4dzxehzkcmqk3c685gukuhjamvcs690tdlemrcrvttjy273gqmsrh2us5'
  const balance = await getBalance(address)
  console.log(balance)
}

async function getBalance(address) {
  try {
    let inscriptions = []
    const {
      bitcoin: { addresses },
    } = mempoolJS({
      hostname: 'mempool.space',
      network: 'testnet',
    })

    const transactions = await addresses.getAddressTxsUtxo({ address })
    for (let i = 0; i < transactions.length; i++) {
      try {
        const response = await axios.get(
          `https://testnet.ordinals.com/preview/${transactions[i].txid}i0`
        )
        if (response.status === 200) {
          inscriptions.push(transactions[i].txid)
        }
      } catch (error) {
        // Handle specific error for 404 (Not Found) status code
        if (error.response && error.response.status === 404) {
        } else {
          console.error(
            `Error processing transaction ${transactions[i].txid}:`,
            error
          )
        }
      }
    }
    return inscriptions
  } catch (error) {}
}

main().catch(console.error)
