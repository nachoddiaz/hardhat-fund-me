const { ethers, getNamedAccounts } = require("hardhat")

async function main(){
    const {deployer} = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("Funding Contract...")
    const TXResponse = await fundMe.fund({value: ethers.utils.parseEther("1")})
    await TXResponse.wait(1)
    console.log("Contract Funded")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error()
    process.exit(1)
  })
