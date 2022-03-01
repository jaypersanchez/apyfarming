const { expect } = require("chai");
var assert = require('assert');
const { ethers } = require("hardhat");
const { BigNumber } = require('ethers');
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();


var CONTRACT_OWNER_ADDRESS = null;
var RECEIVER_ACCOUNT_ADDRESS = null;
var STAKER_ADDRESS_1 = null;
var STAKER_ADDRESS_2 = null;
var STAKER_ADDRESS_3 = null;
const pondTokenToFarming = "100000";
const totalSupply = "1000000000";
const stakeAmount = "10000";
var accounts = null;
var Farming = null;
var PondToken = null;
var farmingInstance = null;
var pondTokenInstance = null;

beforeEach(async () => {
    accounts = await hre.ethers.getSigners();
    CONTRACT_OWNER_ADDRESS = accounts[0].address;
    RECEIVER_ACCOUNT_ADDRESS = accounts[1].address;
    Farming = await ethers.getContractFactory("Farming");
    PondToken = await ethers.getContractFactory("PondToken")
    pondTokenInstance = await PondToken.deploy(totalSupply);
    farmingInstance = await Farming.deploy(pondTokenInstance.address);
    assert(pondTokenInstance !== 'undefined', 'PondToken must be initialized');
    assert(farmingInstance !== 'undefined', 'Farming contract must be initialieze')
})

it('Initial desposit of PondToken to staker addresses for testing', async () => {
    STAKER_ADDRESS_1 = accounts[2].address;
    STAKER_ADDRESS_2 = accounts[3].address;
    STAKER_ADDRESS_3 = accounts[4].address;
    await pondTokenInstance.transfer(farmingInstance.address, pondTokenToFarming);
    await pondTokenInstance.transfer(STAKER_ADDRESS_1, stakeAmount);
    await pondTokenInstance.transfer(STAKER_ADDRESS_2, stakeAmount);
    await pondTokenInstance.transfer(STAKER_ADDRESS_3, stakeAmount);
    let farmPondTokenBalance = await pondTokenInstance.balanceOf(farmingInstance.address);
    let staker1PondTokenBalance = await pondTokenInstance.balanceOf(STAKER_ADDRESS_1);
    let staker2PondTokenBalance = await pondTokenInstance.balanceOf(STAKER_ADDRESS_2);
    let staker3PondTokenBalance = await pondTokenInstance.balanceOf(STAKER_ADDRESS_3);
    assert.equal(farmPondTokenBalance, pondTokenToFarming);
    assert.equal(staker1PondTokenBalance, stakeAmount)
})

it("User's must stake in Farming before participating", async () => {
    let isapprove = await pondTokenInstance.approve(farmingInstance.address, 1000);
    let staketx = await farmingInstance.stakeTokens(1000);
    let farmPondTokenBalance = await pondTokenInstance.balanceOf(farmingInstance.address);
    console.log(`${JSON.stringify(isapprove)} ${farmPondTokenBalance}`);
    assert.equal(farmPondTokenBalance, 1000);
})

it("User's must be able to stake and unstake", async () => {
    let isapprove = await pondTokenInstance.approve(farmingInstance.address, 1000);
    let staketx = await farmingInstance.stakeTokens(1000);
    let stakedBalance = await pondTokenInstance.balanceOf(farmingInstance.address);
    let unstakex = await farmingInstance.unstakeTokens();
    let unstakedBalance = await pondTokenInstance.balanceOf(farmingInstance.address);
    console.log(`${stakedBalance} :: ${unstakedBalance}`);
    assert(unstakedBalance < stakedBalance, "Should not have anymore balance.");  
})

