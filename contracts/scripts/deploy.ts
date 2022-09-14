import { ethers } from "hardhat";

async function main() {
  const splitter = await ethers.getContractFactory("PaymentSplitter");
  const Splitter = await splitter.deploy();

  await Splitter.deployed();

  console.log(`Contract deployed to ${Splitter.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
