const { deployments, run } = require("hardhat")

const {logs } = deployments
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Contrato ya verificado")
    } else {
      console.log(e)
    }
  }
}

  
module.exports = {verify}