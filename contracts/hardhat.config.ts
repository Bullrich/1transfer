import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  typechain: {
    outDir: "../src/lib/contracts",
    target: "ethers-v5"
  }
};

export default config;
