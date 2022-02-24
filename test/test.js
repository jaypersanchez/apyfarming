const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();


describe("Farming", function () {

  let CONTRACT_OWNER_ADDRESS = null;
  let RECEIVER_ACCOUNT_ADDRESS = null;
  let STAKER_ADDRESS_1 = null;
  let STAKER_ADDRESS_2 = null;
  let STAKER_ADDRESS_3 = null;
  const totalSupply = "1000000000";
  const stakeAmount = "10000";
  let Farming = null;
  let PondToken = null;
  let farmingInstance = null;
  let pondTokenInstance = null;
  

  it("Should create PondToken and Farming Contract Instances", async function () {
    const accounts = await hre.ethers.getSigners();
    CONTRACT_OWNER_ADDRESS = accounts[0].address;
    RECEIVER_ACCOUNT_ADDRESS = accounts[1].address;
    console.log(`Accounts ${CONTRACT_OWNER_ADDRESS} ${RECEIVER_ACCOUNT_ADDRESS}`)
    Farming = await ethers.getContractFactory("Farming");
    PondToken = await ethers.getContractFactory("PondToken")
    pondTokenInstance = await PondToken.deploy(totalSupply);
    console.log(`PondToken Address ${pondTokenInstance.address}`)
    farmingInstance = await Farming.deploy(pondTokenInstance.address);
    let msgsender = await pondTokenInstance.getMsgSender();
    console.log(`MSGSENDER ${msgsender}`)
    let owner_balance = await pondTokenInstance.balanceOf(CONTRACT_OWNER_ADDRESS);
    console.log(`Balance token owner ${owner_balance}`)
    /*let result = await farmingInstance.getRewardTokens();
    console.log(`Result ${result}`)*/
  });

  it("Should be able to stake a user token", async function () {
    const accounts = await hre.ethers.getSigners();
    CONTRACT_OWNER_ADDRESS = accounts[0].address;
    RECEIVER_ACCOUNT_ADDRESS = accounts[1].address;
    Farming = await ethers.getContractFactory("Farming");
    PondToken = await ethers.getContractFactory("PondToken")
    pondTokenInstance = await PondToken.deploy(totalSupply);
    farmingInstance = await Farming.deploy(pondTokenInstance.address);
    //issue, air drop Pond token to a test receiver address
    await pondTokenInstance.transfer(RECEIVER_ACCOUNT_ADDRESS, stakeAmount);
    await pondTokenInstance.transfer(STAKER_ADDRESS_1, stakeAmount);
    await pondTokenInstance.transfer(STAKER_ADDRESS_2, stakeAmount);
    await pondTokenInstance.transfer(STAKER_ADDRESS_3, stakeAmount);
    let receiver_balance = await pondTokenInstance.balanceOf(RECEIVER_ACCOUNT_ADDRESS);
    let owner_balance = await pondTokenInstance.balanceOf(CONTRACT_OWNER_ADDRESS);
    console.log(`Balance of Reciever Account ${owner_balance} ${receiver_balance}`)
  })
  
});
