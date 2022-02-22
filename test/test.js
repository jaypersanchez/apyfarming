const { expect } = require("chai");
const { ethers } = require("hardhat");
const { HDWalletProvider } = require('hdwalletprovider')
const provider = new HDWalletProvider(process.env.MNEMONIC,process.env.ALCHEMY_API_URL_RINKEBY);
const web3 = new Web3(provider);
require('dotenv').config();


describe("Farming", function () {

  const CONTRACT_OWNER_ADDRESS = process.env.CONTRACT_OWNER_ADDRESS //"0x6472A63Da4581Dd9090faF7B92C09282b94a06EA";
  const MNEMONIC = process.env.MNEMONIC;
  const totalSupply = "1000000000";
  const stakeAmount = "100";
  let Farming = null;
  let PondToken = null;
  let farmingInstance = null;
  let pondTokenInstance = null;


  it("Should create PondToken and Farming Contract Instances", async function () {
    Farming = await ethers.getContractFactory("Farming");
    PondToken = await ethers.getContractFactory("PondToken")
    pondTokenInstance = await PondToken.deploy(totalSupply);
    farmingInstance = await Farming.deploy(pondTokenInstance.address);
    let result = await farmingInstance.getRewardTokens();
    //console.log(`Result ${result}`)
  });

  it("Should be able to stake a user token", async function () {
      /*let userStakedEvent = farmingInstance.UserStakedToken(function(error, result) {
        if(!error) {
          console.log(`Staked Results ${result}`)
        }
        else {
          console.log(`Staking Error ${error}`)
        }
      })*/
      const tx = {
        from: process.env.CONTRACT_OWNER_ADDRESS,
        to: farmingInstance.address,
        data: farmingInstance.stakeTokens(stakeAmount)
      }
      const signPromise = web3.eth.signTransaction(tx, process.env.PRIVATE_KEY);
      signPromise.then((signedTx) => {
        // raw transaction string may be available in .raw or 
        // .rawTransaction depending on which signTransaction
        // function was called
        const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
        sentTx.on("receipt", receipt => {
          // do something when receipt comes back
          console.log(`Tx Receipt ${receipty}`)
        });
        sentTx.on("error", err => {
          // do something on transaction error
          console.log(`send tx error ${err}`)
        });
      }).catch((err) => {
        // do something when promise fails
        console.log(`fatal error ${err}`)
      });
        })
  
});
