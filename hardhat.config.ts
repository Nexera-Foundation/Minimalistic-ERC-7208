import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "solidity-coverage";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-dependency-compiler";
import "hardhat-gas-reporter"

dotenv.config();

import networks from "./hardhat.networks";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
          },
          viaIR: true,
        },
      },
    ],
  },
  networks,
  namedAccounts: {
    deployer: 0,
    admin: 1,
    minter: 2,
    user: 3,
  },
  typechain: {
    alwaysGenerateOverloads: true,
    outDir: "typechain",
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./tests",
  },
  mocha: {
    // Uncomment when forking live networks
    //timeout: 100000000,
    //parallel: true, // Reduce running time for testing multiple future use-cases
  },
  gasReporter: {
    enabled: true,
  },
};

export default config;
