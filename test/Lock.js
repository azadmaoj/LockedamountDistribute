const { expect } = require("chai");
const { ethers, web3 } = require("hardhat");
const hre = require("hardhat");
require("@nomiclabs/hardhat-web3");

describe("Testing the contract Positive cases ", () => {
  it("Should Deploy the contract", async () => {
    accounts = await ethers.getSigners();
    DistributeDemo = await ethers.getContractFactory("DistributeDemo");
    distributeDemo = await DistributeDemo.deploy(100, 2);
  });

  it("Should Check the Total Amount", async () => {
    expect(await distributeDemo.totalAmount()).to.be.equals(
      ethers.BigNumber.from(100)
    );
  });

  it("Should check the Minumum User", async () => {
    expect(await distributeDemo.minimumUsers()).to.be.equals(
      ethers.BigNumber.from(2)
    );
  });

  it("Should check the balanceOf User 1 before Withdraw", async () => {
    expect(
      await distributeDemo.connect(accounts[1]).balanceOf(accounts[1].address)
    ).to.be.equals(ethers.BigNumber.from(0));
  });

  it("Should check the balanceOf User 2 before Withdraw", async () => {
    expect(
      await distributeDemo.connect(accounts[2]).balanceOf(accounts[2].address)
    ).to.be.equals(ethers.BigNumber.from(0));
  });

  it("Should check the balanceOf User 1 already Withdraw", async () => {
    expect(
      await distributeDemo.alreadyWithdraw(accounts[1].address)
    ).to.be.equals(false);
  });

  it("Should check the balanceOf User 2 already Withdraw", async () => {
    expect(
      await distributeDemo.alreadyWithdraw(accounts[2].address)
    ).to.be.equals(false);
  });

  it("Should check the Total User", async () => {
    expect(await distributeDemo.totalUsers()).to.be.equals(
      ethers.BigNumber.from(0)
    );
  });

  it("Should check the User before Join", async () => {
    expect(await distributeDemo.remainUsers()).to.be.equals(
      ethers.BigNumber.from(0)
    );
  });

  it("Should check the join User 1", async () => {
    joinUser = await distributeDemo.connect(accounts[1]).joinUser();
  });

  it("Should check the Total User after joining of User 1", async () => {
    expect(await distributeDemo.totalUsers()).to.be.equals(
      ethers.BigNumber.from(1)
    );
  });

  it("Should check the join User 2", async () => {
    joinUser = await distributeDemo.connect(accounts[2]).joinUser();
  });
  it("Should check the Total User after joining of User 1", async () => {
    expect(await distributeDemo.totalUsers()).to.be.equals(
      ethers.BigNumber.from(2)
    );
  });

  it("Should withdraw the reward amount of User 1 ", async () => {
    withdraw = await distributeDemo.connect(accounts[1]).withdraw();
  });

  it("Should check the balanceOf User 1 After Withdraw", async () => {
    totalAmount = 100;
    totalUsers = 2;
    reward = totalAmount / totalUsers;

    expect(
      await distributeDemo.connect(accounts[1]).balanceOf(accounts[1].address)
    ).to.be.equals(ethers.BigNumber.from(reward));
  });

  it("Should Check the Total Amount after User 1 withdraw", async () => {
    oldTotalAmount = 100;

    totalAmount = await distributeDemo.totalAmount();
    expect(await distributeDemo.totalAmount()).to.be.equals(
      oldTotalAmount - ethers.BigNumber.from(reward)
    );
  });

  it("Should check the status User 1 already Withdraw", async () => {
    expect(
      await distributeDemo.alreadyWithdraw(accounts[1].address)
    ).to.be.equals(true);
  });

  it("Should check the Remain Users after user 1 withdraw", async () => {
    expect(await distributeDemo.remainUsers()).to.be.equals(1);
  });

  it("Should withdraw the reward amount of User 2 ", async () => {
    withdraw = await distributeDemo.connect(accounts[2]).withdraw();
  });

  it("Should check the balanceOf User 1 After Withdraw", async () => {
    totalAmount = 50;
    totalUsers = 1;
    reward = totalAmount / totalUsers;

    expect(
      await distributeDemo.connect(accounts[2]).balanceOf(accounts[2].address)
    ).to.be.equals(ethers.BigNumber.from(reward));
  });

  it("Should Check the Total Amount after User 2 withdraw", async () => {
    oldTotalAmount = 50;

    totalAmount = await distributeDemo.totalAmount();
    expect(await distributeDemo.totalAmount()).to.be.equals(
      oldTotalAmount - ethers.BigNumber.from(reward)
    );
  });

  it("Should check the status User 2 already Withdraw", async () => {
    expect(
      await distributeDemo.alreadyWithdraw(accounts[2].address)
    ).to.be.equals(true);
  });

  it("Should check the Remain Users after user 2 withdraw", async () => {
    expect(await distributeDemo.remainUsers()).to.be.equals(0);
  });

  });

  describe("Testing the contract Negative cases ", () => {
    it("Should revert to Deploy the contract", async () => {
      accounts = await ethers.getSigners();
      DistributeDemo = await ethers.getContractFactory("DistributeDemo");
      await expect(DistributeDemo.deploy(100, 0)).to.be.revertedWith(
        "minimumUsers must be greater than 0"
      );
      // distributeDemo = await DistributeDemo.deploy(100, 0);
    });

    it("Should revert to Deploy the contract", async () => {
      accounts = await ethers.getSigners();
      DistributeDemo = await ethers.getContractFactory("DistributeDemo");
      distributeDemo = await DistributeDemo.deploy(100, 2);
    });

    it("Should check the join User 1", async () => {
      joinUser = await distributeDemo.connect(accounts[1]).joinUser();
    });

    it("Should revert User Already Joined", async () => {
      await expect(
        distributeDemo.connect(accounts[1]).joinUser()
      ).to.be.revertedWith("User Already Joined");
    });

    it("Should withdraw the reward amount of User 1 ", async () => {
      await expect(
        distributeDemo.connect(accounts[1]).withdraw()
      ).to.be.revertedWith("Wait till Minimum User Join");
    });

    it("Should check the join User 2", async () => {
      joinUser = await distributeDemo.connect(accounts[2]).joinUser();
    });

    it("Should withdraw the reward amount of User 2 ", async () => {
      withdraw = await distributeDemo.connect(accounts[2]).withdraw();
    });

    it("Should withdraw the reward amount of User 2 ", async () => {
      await expect(
        distributeDemo.connect(accounts[2]).withdraw()
      ).to.be.revertedWith("Not in the reward List");
    });
});
