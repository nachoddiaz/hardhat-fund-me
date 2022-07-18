const { ethers, getNamedAccounts } = require("hardhat")

async function main(){
    const {deployer} = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("Withdrawing Contract...")
    const TXResponse = await fundMe.withdraw()
    await TXResponse.wait(1)
    console.log("Contract Withdrawed")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error()
    process.exit(1)
  })
