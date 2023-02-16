const { Description } = require("@ethersproject/properties");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, web3 } = require("hardhat");
const hre = require("hardhat");
require("@nomiclabs/hardhat-web3");

describe("Testing the contract Positive cases ", () => {
  it("Should Deploy the token", async () => {
    accounts = await ethers.getSigners();
    ERC20Token = await ethers.getContractFactory("ERC20Token");
    erc20Token = await ERC20Token.deploy();
  });

  it("Should Deploy the contract", async () => {
    accounts = await ethers.getSigners();
    DistributeDemo = await ethers.getContractFactory("DistributeDemo");
    distributeDemo = await DistributeDemo.deploy(erc20Token.address, 2);
  });

  it("Should Check the Total Amount before deposite", async () => {
    oldRewadBalance = await distributeDemo.totalAmount();
    expect(oldRewadBalance).to.be.equals(ethers.BigNumber.from(0));
  });

  it("Should deposite the reward amount ", async () => {
    amount = ethers.BigNumber.from(100);
    await erc20Token.approve(
      distributeDemo.address,
      ethers.BigNumber.from(10000)
    );
    await distributeDemo.rewardAmount(amount);
  });

  it("Should Check the Total Amount before deposite", async () => {
    expect(await distributeDemo.totalAmount()).to.be.equals(
      oldRewadBalance.add(amount)
    );
  });
  it("Should check the Total User before join User 1", async () => {
    expect(await distributeDemo.totalUsers()).to.be.equals(
      ethers.BigNumber.from(0)
    );
  });

  it("Should check the join User 1", async () => {
    joinUser = await distributeDemo.connect(accounts[1]).joinForReward();
  });

  it("Should check the Total User after joining of User 1", async () => {
    expect(await distributeDemo.totalUsers()).to.be.equals(
      ethers.BigNumber.from(1)
    );
  });

  it("Should check the join User 2", async () => {
    joinUser = await distributeDemo.connect(accounts[2]).joinForReward();
  });
  it("Should check the Total User after joining of User 1", async () => {
    expect(await distributeDemo.totalUsers()).to.be.equals(
      ethers.BigNumber.from(2)
    );
  });
  it("Should check the  User 1 already Withdraw", async () => {
    expect(
      await distributeDemo.alreadyWithdraw(accounts[1].address)
    ).to.be.equals(false);
  });

  it("Should check the  User 2 already Withdraw", async () => {
    expect(
      await distributeDemo.alreadyWithdraw(accounts[2].address)
    ).to.be.equals(false);
  });

  it("Should check the token balanceOf User 1 before Withdraw", async () => {
    oldUser1Balance = await erc20Token.balanceOf(accounts[1].address);
    expect(await erc20Token.balanceOf(accounts[1].address)).to.be.equals(
      oldUser1Balance
    );
  });

  it("Should check the balanceOf User 2 before Withdraw", async () => {
    oldUser2Balance = await erc20Token.balanceOf(accounts[2].address);
    expect(await erc20Token.balanceOf(accounts[2].address)).to.be.equals(
      oldUser2Balance
    );
  });

  it("Should check the Total User after joining of User 2", async () => {
    expect(await distributeDemo.totalUsers()).to.be.equals(
      ethers.BigNumber.from(2)
    );
  });

  it("Should withdraw the reward amount of User 1 ", async () => {
    withdraw = await distributeDemo.connect(accounts[1]).withdrawReward();
  });

  it("Should check the balanceOf User 1 After Withdraw", async () => {
    totalAmount = await distributeDemo.totalAmount();
    totalUsers = await distributeDemo.totalUsers();
    reward = totalAmount / totalUsers;

    expect(await erc20Token.balanceOf(accounts[1].address)).to.be.equals(
      ethers.BigNumber.from(reward)
    );
  });
  it("Should check the status User 1 already Withdraw", async () => {
    expect(
      await distributeDemo.alreadyWithdraw(accounts[1].address)
    ).to.be.equals(true);
  });
  it("Should withdraw the reward amount of User 2 ", async () => {
    withdraw = await distributeDemo.connect(accounts[2]).withdrawReward();
  });

  it("Should check the balanceOf User 2 After Withdraw", async () => {
    totalAmount = await distributeDemo.totalAmount();
    totalUsers = await distributeDemo.totalUsers();
    reward = totalAmount / totalUsers;

    expect(await erc20Token.balanceOf(accounts[2].address)).to.be.equals(
      ethers.BigNumber.from(reward)
    );
  });
  it("Should check the status User 2 already Withdraw", async () => {
    expect(
      await distributeDemo.alreadyWithdraw(accounts[2].address)
    ).to.be.equals(true);
  });
});

describe("Testing the contract Negative cases ", () => {
  it("Should revert to Deploy the contract", async () => {
    accounts = await ethers.getSigners();
    DistributeDemo = await ethers.getContractFactory("DistributeDemo");
    await expect(
      DistributeDemo.deploy(erc20Token.address, 0)
    ).to.be.revertedWith("minimumUsers must be greater than 0");
  });

  it("Should Deploy the token", async () => {
    accounts = await ethers.getSigners();
    ERC20Token = await ethers.getContractFactory("ERC20Token");
    erc20Token = await ERC20Token.deploy();
  });

  it("Should Deploy the contract", async () => {
    accounts = await ethers.getSigners();
    DistributeDemo = await ethers.getContractFactory("DistributeDemo");
    distributeDemo = await DistributeDemo.deploy(erc20Token.address, 2);
  });

  it("Should check the join User 1", async () => {
    joinUser = await distributeDemo.connect(accounts[1]).joinForReward();
  });

  it("Should revert User Already Joined", async () => {
    await expect(
      distributeDemo.connect(accounts[1]).joinForReward()
    ).to.be.revertedWith("User Already Joined");
  });

  it("Should withdraw the reward amount of User 1 ", async () => {
    await expect(
      distributeDemo.connect(accounts[1]).withdrawReward()
    ).to.be.revertedWith("Wait till Minimum User Join");
  });

  it("Should check the join User 2", async () => {
    joinUser = await distributeDemo.connect(accounts[2]).joinForReward();
  });

  it("Should withdraw the reward amount of User 2 ", async () => {
    withdraw = await distributeDemo.connect(accounts[2]).withdrawReward();
  });

  it("Should withdraw the reward amount of User 2 ", async () => {
    await expect(
      distributeDemo.connect(accounts[2]).withdrawReward()
    ).to.be.revertedWith("Not in the reward List");
  });
});
