/* Podemos definir la función así
function deployFunc(hre){
    console.log("hii")
}

module.exports.default = deployFunc
 */

//Pero vamos a declarar una funcion anónima

/* module.exports = async (hre) => {
    //Idem a const { ethers, run, network } = require("hardhat")
    const {getNameAccounts, deployments} = hre
} */

const { networkConfig, devChains } = require("../helper-hardhat-config.js")
const { getNamedAccounts, deployments, network } = require("hardhat")
const { verify } = require("../utils/verify.js")

//Podemos resumir las dos lineas anteriores en una sola
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  let ETHUSDPriceAddress //ponemos let para poder actualiarla
  if (chainId == 31337) {
    //Si estamos en devChain, desplegamos mock
    const ETHUSDAgregator = await deployments.get("MockV3Aggregator")
    ETHUSDPriceAddress = ETHUSDAgregator.address
  } else {
    //Si no estamos en devChain, desplegamos normal
    ETHUSDPriceAddress = networkConfig[chainId]["ETHUSDPrice"]
  }


  //cuando trabajemos localhost o en la red hardhat, usaremos un mock
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ETHUSDPriceAddress], // estos argumentos se le pasan al constructor
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1
  })

  if (!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(fundMe.address, [ETHUSDPriceAddress])
  }
  log(
    "----------------------------------------------------------------------------------------------"
  )
}

module.exports.tags = ["all", "fundme"]
