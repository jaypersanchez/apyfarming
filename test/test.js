const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require('ethers');
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();


describe("Farming", function () {

  let CONTRACT_OWNER_ADDRESS = null;
  let RECEIVER_ACCOUNT_ADDRESS = null;
  let STAKER_ADDRESS_1 = null;
  let STAKER_ADDRESS_2 = null;
  let STAKER_ADDRESS_3 = null;
  const pondTokenToFarming = "100000";
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
    STAKER_ADDRESS_1 = accounts[2].address;
    STAKER_ADDRESS_2 = accounts[3].address;
    STAKER_ADDRESS_3 = accounts[4].address;
    Farming = await ethers.getContractFactory("Farming");
    FarmingA = await ethers.getContractFactory("Farming");
    const farmingAInstance = await FarmingA.attach(STAKER_ADDRESS_1);
    PondToken = await ethers.getContractFactory("PondToken")
    pondTokenInstance = await PondToken.deploy(totalSupply);
    farmingInstance = await Farming.deploy(pondTokenInstance.address);
    //PondToken need to transfer to Farming contract to have starting balance.
    await pondTokenInstance.transfer(farmingInstance.address, pondTokenToFarming);
    await pondTokenInstance.transfer(STAKER_ADDRESS_1, stakeAmount);
    let staker1PondTokenBalance = await pondTokenInstance.balanceOf(STAKER_ADDRESS_1);
    let farmPondTokenBalance = await pondTokenInstance.balanceOf(farmingInstance.address);
    console.log(`PondToken Balance farmingInstance :: stakeradd1 ${farmPondTokenBalance}::${staker1PondTokenBalance}`);


    //farmingAInstance.UserStakedToken
    await pondTokenInstance.approve(farmingInstance.address, stakeAmount)
    await farmingInstance.stakeTokens(100);
    //listen to staking event
    /*var stakeevent = await farmingInstance.UserStakedToken();
    stakeevent.watch(function(error, result) {
          if(!error) {
              console.log(`${result.args.hasstaked} :: ${result.args.staker} :: ${result.args.stakedamount}`)
          }
          else {
              console.log(`Error in staking`)
          }
    })*/
  })

  it("Should be able to take PondToken from an address from Farming or another approved wallet", async function() {

  });
  
});
