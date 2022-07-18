const { ethers, getNamedAccounts, network } = require("hardhat")
const { assert } = require("chai")
const { devChains} = require("../../helper-hardhat-config")


//En la etapa Staging, debemos estar en testnet
//Si existe network.name, nos saltamos el describe, si no existe los ejecutamos
devChains.includes(network.name)
 ? describe.skip 
 : describe("FundMe", function() {
    let FundMe
    let deployer
    const sendValue = ethers.utils.parseEther("0.04")
    beforeEach( async () =>{
        deployer = (await  getNamedAccounts()).deployer
        FundMe = await ethers.getContract("FundMe", deployer)

    })
    it("Permite depositar y retirar fondos", async () =>{
        const fondeo = await FundMe.fund({value: sendValue})
        await fondeo.wait(1)
        const retiro = await FundMe.withdraw()
        await retiro.wait(1)
        const endingBalance = await FundMe.provider.getBalance(FundMe.address)
        assert.equal(endingBalance.toString(), "0")
    })
 })