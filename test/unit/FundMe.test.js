const { ethers, deployments, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { devChains } = require("../../helper-hardhat-config")

!devChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", function() {
      let fundMe
      let deployer
      let MockV3aggregator
      const sendValue = ethers.utils.parseEther("1")

      beforeEach(async function() {
        /* //otra forma de hacerlo
        const accounts = await getNamedAccounts()
        const accountZero = accounts[0] */
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"]) //Con esta linea se deplega todo el contrato
        fundMe = await ethers.getContract("FundMe", deployer) //Coge el último deploy de FunMe
        MockV3aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        )
      })

      describe("constructor", async function() {
        it("sets the aggregator addresses correctly", async function() {
          const respuesta = await fundMe.s_priceFeed()
          assert.equal(respuesta, MockV3aggregator.address)
        })
      })
      describe("fund", async function() {
        it("Fails if not receive enough ETH", async function() {
          //!FundMe.fund()
          await expect(fundMe.fund()).to.be.revertedWith("Not enough money!!")
        })
        it("update corrrectly the data structure of the amount funded ", async function() {
          await fundMe.fund({ value: sendValue })
          const respuesta = await fundMe.getAddress2donacion(deployer)
          assert.equal(respuesta.toString(), sendValue.toString())
        })
        it("add correctly s_funders to the s_funders array ", async function() {
          await fundMe.fund({ value: sendValue })
          const funder = await fundMe.getFunders(0)
          assert.equal(funder, deployer)
        })
      })

      describe("withdraw", async function() {
        beforeEach(async function() {
          await fundMe.fund({ value: sendValue })
        })

        it("Withdraw ETH from a single founder ", async () => {
          //Arrange
          const startingContractBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          //Act
          const TXResponse = await fundMe.withdraw()
          const TXReceipt = await TXResponse.wait()
          const { gasUsed, effectiveGasPrice } = TXReceipt
          const gasCost = gasUsed.mul(effectiveGasPrice)

          const endingContractBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          //Assert
          assert.equal(endingContractBalance, 0)
          assert.equal(
            startingContractBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )
        })
        it("Allow to withdraw ETH from several s_funders ", async () => {
          const accounts = await ethers.getSigners() //Creamos varias accounts
          for (let i = 1; i < 15; i++) {
            //Empezamos en 1 pq 0 es el deployer, 6 por poner un numero
            /* Creamos otra variable donde desplegar el contrato pq "fundMe" está unido al deployer
            y la unimos al account correspondiente */
            const ConnnectedContract = await fundMe.connect(accounts[i])
            await ConnnectedContract.fund({ value: sendValue })
          }
          //Arrange
          const startingContractBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          //Act
          const TXResponse = await fundMe.withdraw()
          const TXReceipt = await TXResponse.wait()
          const { gasUsed, effectiveGasPrice } = TXReceipt
          const gasCost = gasUsed.mul(effectiveGasPrice)

          const endingContractBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          //Assert
          assert.equal(endingContractBalance, 0)
          assert.equal(
            startingContractBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )

          //Comprobamos que todos los s_funders están a 0
          await expect(fundMe.getFunders(0)).to.be.reverted

          for (i = 1; i < 15; i++) {
            //Comprobamos que las donaciones de cada funder están a 0
            assert.equal(
              await fundMe.getAddress2donacion(accounts[i].address),
              0
            )
          }
        })
      })
      it("Only allows the owner to withdraw funds", async () => {
        const accounts = await ethers.getSigners()
        const ContratoAtacado = await fundMe.connect(accounts[1])
        await expect(ContratoAtacado.withdraw()).to.be.rejected
      })

      /*---------------------------------------------------------------------------------*/

      describe("CheaperWithdraw", async function() {
        beforeEach(async function() {
          await fundMe.fund({ value: sendValue })
        })

        it("Withdraw ETH from a single founder ", async () => {
          //Arrange
          const startingContractBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          //Act
          const TXResponse = await fundMe.CheaperWithdraw()
          const TXReceipt = await TXResponse.wait()
          const { gasUsed, effectiveGasPrice } = TXReceipt
          const gasCost = gasUsed.mul(effectiveGasPrice)

          const endingContractBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          //Assert
          assert.equal(endingContractBalance, 0)
          assert.equal(
            startingContractBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )
        })
        it("Allow to withdraw ETH from several s_funders ", async () => {
          const accounts = await ethers.getSigners() //Creamos varias accounts
          for (let i = 1; i < 15; i++) {
            //Empezamos en 1 pq 0 es el deployer, 6 por poner un numero
            /* Creamos otra variable donde desplegar el contrato pq "fundMe" está unido al deployer
                y la unimos al account correspondiente */
            const ConnnectedContract = await fundMe.connect(accounts[i])
            await ConnnectedContract.fund({ value: sendValue })
          }
          //Arrange
          const startingContractBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          //Act
          const TXResponse = await fundMe.CheaperWithdraw()
          const TXReceipt = await TXResponse.wait()
          const { gasUsed, effectiveGasPrice } = TXReceipt
          const gasCost = gasUsed.mul(effectiveGasPrice)

          const endingContractBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          //Assert
          assert.equal(endingContractBalance, 0)
          assert.equal(
            startingContractBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )

          //Comprobamos que todos los s_getFunders están a 0
          await expect(fundMe.getFunders(0)).to.be.reverted

          for (i = 1; i < 15; i++) {
            //Comprobamos que las donaciones de cada funder están a 0
            assert.equal(
              await fundMe.getAddress2donacion(accounts[i].address),
              0
            )
          }
        })
      })
      it("Only allows the owner to withdraw funds", async () => {
        const accounts = await ethers.getSigners()
        const ContratoAtacado = await fundMe.connect(accounts[1])
        await expect(ContratoAtacado.CheaperWithdraw()).to.be.rejected
      })
    })
