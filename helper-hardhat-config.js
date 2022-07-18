const { deployments } = require("hardhat")
const { namedAccounts } = require("./hardhat.config")

const networkConfig = {
    1:{
        name: "ethereum mainnet",
        ETHUSDPrice: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    },
    4: { //Configuramos la red Rinkeby con su chainID, nombre y dirección
        name: "rinkeby",
        ETHUSDPrice: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },
    137:{
        name: "polygon mainnet",
        ETHUSDPrice: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    },
    31337: {
        name: "localhost",
    },
}


const devChains = ["hardhat", "localhost"]
const DECIMALS = 8
const INIT_ANSWER =  200000000000

module.exports ={
    networkConfig,
    devChains,
    DECIMALS,
    INIT_ANSWER,
}