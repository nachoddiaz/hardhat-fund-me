require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()
require("hardhat-gas-reporter")

const Rinkeby_URL = process.env.Rinkeby_RPC_URL
const PRIVATE_KEY_RINKEBY = process.env.Private_KEY
const CMC_API_KEY = process.env.CMCAPI
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

module.exports = {
  //solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: Rinkeby_URL,
      accounts: [PRIVATE_KEY_RINKEBY],
      chainId: 4,
      blockConfirmations: 6 // esperamos 6 para que a etherscan le de tiempo a indexar nuestra TX
    }
  },
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }]
  },
  defaultNetwork: "hardhat",
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: CMC_API_KEY,
    //token: "MATIC"
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  namedAccounts: {
    deployer: {
      default: 0
    },
    users: {
      default: 0
    }
  }
}
