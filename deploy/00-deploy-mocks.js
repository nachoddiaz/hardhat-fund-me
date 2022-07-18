const { network } = require("hardhat")
const {DECIMALS, 
    INIT_ANSWER 
} = require("../helper-hardhat-config")


module.exports = async ({getNamedAccounts, deployments}) => {
    const { deploy, log } = deployments
    const {deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //No queremos desplegar el contrato en testnet o mainnet
    if(chainId == 31337) { //Si estamos en localhost o hardhat, desplegamos mocks
        log("local network detected -> Deploying mocks")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            //Para saber que argumentos pasarle al contrato lo buscamos en github o node_modules
            args: [DECIMALS, INIT_ANSWER],
        })
        log("Mocks deployed!!!!")
        log("----------------------------------------------------------------------------------------------")

    }
}
//introducimos la opcion de deployar "all" o solo los "mocks"
module.exports.tags = ["all", "mocks"] 