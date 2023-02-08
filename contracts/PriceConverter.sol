//Creanos una librería que hará las operaciones de la conversion del precio



pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


library PriceConverter{

     /**
     * @dev Gets the current eth price from an oracle.
     * @param priceFeed Address of an AggregatorV3Interface contract that provides pricing.
     * @return The price of ETH in USD.
     */

    function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256){
        //Como debemos interactuar con un contrato exterior ya existente, Address y ABI
        //Address 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        //Si añadimos el priceFeed, no hace falta hardcodear la dirección del oráculo
        //AggregatorV3Interface priceFeed= AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        (,int256 answer, , , )=  priceFeed.latestRoundData(); //Con esto conseguimos el precio de ETH en USD 
        return uint256(answer * 1e10);  //Le quitamos 10 decimales y lo convertimos en uint256 para operar con msg.value
    }

    /* function getConvRate() internal view returns (uint256){
        AggregatorV3Interface pr = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        return pr.version();
    } */

    /**
     * @dev Gets a conversion rate from ETH-USD.
     * @param ethAmount Amount of ETH to convert.
     * @param priceFeed Address of an AggregatorV3Interface contract that provides pricing.
     * @return The amount in USD for the given ETH amount.
     */
    function getConvRate(uint256 ethAmount, AggregatorV3Interface priceFeed ) internal view returns (uint256){
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethEnUsd = (ethPrice * ethAmount) / 1e18;

        return ethEnUsd;



    }



}