<div align="center">

# **Minimalistic Data Index** <!-- omit in toc -->

![Build and Test](https://github.com/NexeraProtocol/Minimalistic-Data-Index/actions/workflows/contracts-build-test.yaml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[EIP-7208](https://eips.ethereum.org/EIPS/eip-7208) • [AllianceBlock](https://allianceblock.io) • [Code](https://github.com/NexeraProtocol/Minimalistic-Data-Index/)

</div>

---
- [1. What is the Minimalistic Data Index](#🚀-minimalistic-data-index)
- [2. How to Set Up](#🔬-setup)
- [3. Usage](#🛠-usage)
- [4. For Devs](#✨-deploying-contracts)

# 🚀 **Minimalistic Data Index**

This repository contains a set of contracts that implement the [ERC-7208](https://eips.ethereum.org/EIPS/eip-7208) standard in a minimalistic manner to demonstrate the core capabilities of this ERC.

## What is the Minimalistic Data Index

The Minimalistic Data Index is an implementation of the [ERC-7208](https://eips.ethereum.org/EIPS/eip-7208) standard. [ERC-7208](https://eips.ethereum.org/EIPS/eip-7208) defines a series of interfaces for indexing and managing data in smart contracts through "Data Objects" (DO). This minimalistic variant showcases how the different components of [ERC-7208](https://eips.ethereum.org/EIPS/eip-7208) work together.

### Key Components:

- **Data Objects (DO):** These are the primary containers for storing information on-chain.
- **Data Managers (DM):** Smart contracts that access and modify the data stored in Data Objects.
- **Data Index (DI):** Implementations that manage access to Data Objects.
- **Data Points (DP):** Structures that abstract the storage of data.
- **Data Point Registries (DPR):** Interfaces that ensure compatibility and enable data portability between different implementations of [ERC-7208](https://eips.ethereum.org/EIPS/eip-7208).

By separating the storage of data from the logic functions that govern it, [ERC-7208](https://eips.ethereum.org/EIPS/eip-7208) allows for more modular and flexible smart contract designs. The Minimalistic Data Index provides a simplified example of how these interfaces can be implemented and used in practice.

As example implementation of a Data Manager this repository includes the `MinimalisticERC1155WithERC20FractionsDataManager.sol` contract which is a Data Manager that exposes the ERC1155 functionality where each token ID can be treated as an individual ERC20 token through the use of the `MinimalisticERC20FractionDataManager.sol`.

To be able to do this, the `MinimalisticERC1155WithERC20FractionsDataManager.sol` contract uses the `MinimalisticFungibleFractionsDO.sol` Data Object which stores the necessary information to manage the id, balances and total supply of the tokens.

## 🔬 **Setup**

### _This repository requires some familiarity with:_

- [Solidity](https://docs.soliditylang.org/en/latest/)
- [yarn](https://yarnpkg.com/getting-started)
- [TypeScript](https://www.typescriptlang.org/)
- [hardhat](https://hardhat.org/)
- [ethers.js](https://docs.ethers.io/v5/)

### 1. Install dependencies

```
yarn & yarn install
```

### 2. Build contracts

```
yarn build
```

## 3. Tests

```
yarn test
```

## ✨ **Deploying and set up contracts**

### 1. Deploy core contracts (Data Index and Data Point Registry)

```
yarn deploy:core --network <network>
```

### 2. Deploy Data Objects and Data Managers

To deploy the examples, the associated data point and metadata must first be set in the [constants.ts](./utils/constants.ts) file.
To create a new data point see [Allocate data point](#allocate-data-point).

```
yarn deploy:examples --network <network>
```

After deploying the contracts, the Data Manager must be allowed to manage the information associated to the data point in the Data Object by calling the `allowDataManager` function in the Data Index contract. Then the Data Index implementation must be set and linked to the data point in the Data Object by calling the `setDataIndexImplementation` function in the Data Object contract.

---

Until this point most of the Data Managers are ready to be used, but in this implementation the `MinimalisticERC1155WithERC20FractionsDataManager.sol` contract needs to be admin of the data point to be able to allow the `MinimalisticERC20FractionDataManager.sol` contract to manage the data point when they are deployed. To do this the `MinimalisticERC1155WithERC20FractionsDataManager.sol` contract must be admin of the data point calling the `grantAdminRole` function in the Data Point Registry contract.

The script [Set up Data Manager](#set-up-data-manager) can be used to execute the previous steps.

## 🛠️ **Utility scripts**

### Allocate data point

```
yarn allocateDataPoint --network <network>
```

### Set up Data Manager

To set up the Data Manager the associated data point must first be set in the [constants.ts](./utils/constants.ts) file.

```
yarn setUpDataManager --network <network>
```
