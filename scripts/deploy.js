// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  ERC20Token = await ethers.getContractFactory("ERC20Token");
  erc20Token = await ERC20Token.deploy();
  console.log(
    "🚀 ~ file: deploy.js:12 ~ main ~ erc20Token",
    erc20Token.address
  );

  DistributeDemo = await ethers.getContractFactory("DistributeDemo");
  distributeDemo = await DistributeDemo.deploy(erc20Token.address, 2);
  console.log(
    "🚀 ~ file: deploy.js:17 ~ main ~ distributeDemo",
    distributeDemo.address
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
