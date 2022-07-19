//Queremos poder alamacenar fondos de usuarios
//Poder retirarlos
//Poder setear unos fondos mínimos valorados en USD

//SPDX-License-Identifier: MIT

//Gas inicial 882144
//            862614
pragma solidity ^0.8.8;

import "./PriceConverter.sol";
import "hardhat/console.sol";

error FundMe__NotOwner();

/** @title A contract to crowfund organizations
    @author Nacho Díaz
    @notice Used to learn how to fund and withdraw from a contract
    @dev 
 */
contract FundMe {
  //Type Declarations
  using PriceConverter for uint256;

  //sin constant  23471
  //con constant 	21371
  //ahorro = 2100 gas * 8000000000 wei/gas = 1.68e13 = 0.0000168ETH = 0.0205968 USD

  uint256 public constant MIN_USD = 50 * 1e18;
  address[] private s_funders;
  mapping(address => uint256) private s_Address2donacion;

  address private immutable i_owner;

  AggregatorV3Interface public s_priceFeed;

  modifier onlyOwner() {
    if (msg.sender != i_owner)
      revert FundMe__NotOwner();
    _;
  }

  //Que pasa si alguien manda ETH a este contrato sin acceder a la función fund

  receive() external payable {
    fund();
  }

  fallback() external payable {
    fund();
  }

  constructor(address priceFeedAddress) {
    i_owner = msg.sender; //Con esto inicializamos owner con la dirección que despliegue el contrato
    s_priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  /**@notice This function allow to fund the contract with a minimum of 50 USD
        @dev getConvRate (in PriceConverter.sol) returns the current conversion rate, uses  the function
        getPrice that uses AggregatorV3Interface.sol from chainlink
    */
  function fund() public payable {
    //msg.value.getConvRate(); //el valor de msg.value se va a pasar como variable a la funcion getConvRate
    require(msg.value.getConvRate(s_priceFeed) >= MIN_USD, "Not enough money!!"); //msg.value viene en WEI, 18 decimales
    s_Address2donacion[msg.sender] += msg.value;
    s_funders.push(msg.sender);
  }

  function withdraw() public onlyOwner {
    //Vamos direccion por direccion y ponemos que cada una ha donado 0
    for (uint256 funderIndex = 0; funderIndex < s_funders.length; funderIndex++) {
      address funder = s_funders[funderIndex];
      s_Address2donacion[funder] = 0;
    }
    //Reseteamos el vector que contenía todas las direcciones donadoras
    s_funders = new address[](0);

    //Retiramos los fondos del contrato
    //Transfer
    //payable(msg.sender).transfer(address(this).balance);
    //Send
    // bool sendSuccess = payable(msg.sender).send(address(this).blance);
    //require(sendSuccess, "Send failed");
    //call -> comando de nivel bajo
    (bool Success, ) = i_owner.call{value: address(this).balance}("");
    require(Success, "Llamada a la funcion fallida");
  }

  function CheaperWithdraw() public payable onlyOwner{
    //Leemos el array 1 vez desde storage y luego el for desde memoria
    //con s_Address2donacion no podemos hacerlo pq es un mapping
    address[] memory funders = s_funders;
    for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
      address funder = funders[funderIndex];
      s_Address2donacion[funder] = 0;
    }
    s_funders = new address[](0);
    (bool Success, ) = i_owner.call{value: address(this).balance}("");
    require(Success, "Llamada a la funcion fallida");
  }

  function getOwner () public view returns(address){
    return i_owner;
  }

  function getFunders (uint256 index) public view returns(address){
    return s_funders[index];
  }

   function getAddress2donacion (address funder) public view returns(uint256){
    return s_Address2donacion[funder];
  }

  function getpriceFeed() public view returns(AggregatorV3Interface){
    return s_priceFeed;
  }
}
