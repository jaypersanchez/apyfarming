const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Farming", function () {

  const CONTRACT_OWNER_ADDRESS = "0x6472A63Da4581Dd9090faF7B92C09282b94a06EA";
  const totalSupply = "1000000000";

  it("Should create PondToken and Farming Contract Instances", async function () {
    const Farming = await ethers.getContractFactory("Farming");
    const PondToken = await ethers.getContractFactory("PondToken")
    const pondTokenInstance = await PondToken.deploy(totalSupply);
    const farmingInstance = await Farming.deploy(pondTokenInstance.address);
    let result = await farmingInstance.getRewardTokens();
    console.log(`Result ${result}`)
    
  });
  
});
