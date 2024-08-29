<div align="center">

# **Minimalistic Data Index** <!-- omit in toc -->

![Build and Test](https://github.com/NexeraProtocol/Minimalistic-Data-Index/actions/workflows/contracts-build-test.yaml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[EIP-7208](https://eips.ethereum.org/EIPS/eip-7208) • [AllianceBlock](https://allianceblock.io) • [Code](https://github.com/NexeraProtocol/Minimalistic-Data-Index/)

</div>

- [1. What is ERC-7208](#-1-what-is-ERC-7208)
- [2. What brings Minimalistic](#-2-what-is-minimalistic)
- [3. Architecture](#-3-architecture)
- [4. How to Set Up](#-4-how-to-set-up)
- [5. Deploying and set up contracts](#-5-deploying-and-set-up-contracts)
- [6. Tests](#-6-tests)
- [7. Utility scripts](#-7-utility-scripts)
- [8. Contributing](#-8-contributing)
- [9. License](#-9-license)

## 🔌 **1. What is ERC-7208**

ERC-7208 is a standard that enhances the compatibility of assets with existing infrastructures and protocols built for Web3.

In this new ecosystem, the market has made neccesary the creation and evolution of standards which, until now, were created only to cover a specific need and were not necessarily compatible with existing products, dApps, or protocols.

ERC-7208 aims to be a timeless standard, capable of adapting to market needs, compliance requirements, and emerging standards. By abstracting the logic within the storage, it allows for easy adaptation and interaction with other protocols and dApps.

This standard, also known as Onchain Data Containers (ODCs), gives developers the possiblity to:

1. **Making assets interoperable**: Issue one asset under an specific standard (f.e. ERC721) and after deployment, if convenient, trade it as an ERC20 token.

2. **Adapting one standard to another**: If you are collecting ERC-721 NFTs and want to make them Rentable (ERC-4907), you would store the NFT in a DataObject and expose it through a DataManager implementing the ERC-4907 interface.

3. **Modifying the logic of a particular asset**: If you have a certain RWA and the regulatory framework on your current jurisdiction has changed, you may require an update to the Smart Contract managing such asset.

For more detailed explanation, please visit [Ethereum EIPs](https://eips.ethereum.org/EIPS/eip-7208).

## ⚪️ **2. What brings Minimalistic**

This repository contains a simple, educational purpose implementation following Onchain Data Index (ERC-7208).
Please, do not use this example for production, if you want to implement ERC-7208 go to [Contributing](#🤝-Contributing) or contact [EvergonLabs](https://www.evergonlabs.com).

## 🔬 **3. Architecture**

![ERC-7208 Technical Overview](./assets/erc-7208-technical-overview.svg)

### 3.1. Naming conventions

**DataPoint (DP):** Bytes32 indexed lowl-level data storage.

**DataPoint Registry (DPR):** Defines Access management and DataPoint compatibility.

**Data Indexer: (DI)** Indexes information and approvals.

**Data Manager (DM):** Interface for the user, implements business logic.

**Data Object (DO)**: Defindes the logic of the data management.

### 3.2. Overall explanation

The Data Index is a smart contract entrusted with access control. It is a gating mechanism for Data Managers to access Data Objects. If a Data Manager intends to access a Data Point (either by read(), write(), or any other method), the Data Index should be used for validating access to the data.

Data Objects are entrusted with the management of transactions that affect the storage of Data Points. Data Objects can receive read(), write(), or any other custom requests from a Data Manager requesting access to a Data Point. As such, Data Objects respond to a gating mechanism given by a single Data Index.

Data Points are the low-level structure abstracting information. Data Points are allocated by a Data Point Registry, and this information should be stored within its internal structure. Each Data Point should have a unique identifier provided by the Data Point Registry when instantiated.

Data Managers are independent smart contracts that implement the business logic or “high-level” data management. They can either read() from a Data Object address and write() through a Data Index Implementation managing the delegated storage of the Data Points. Data Managers can include desired interfaces in order to follow a standard (ERC20, ERC721, ERC1155, ERC3643, etc.) .

### **Simplified diagram**

<img alt="Technical Overview" src=".github/DataIndexDiagram.png" width="693px" />

As example implementation of a Data Manager this repository includes the `MinimalisticERC1155WithERC20FractionsDataManager.sol` contract which is a Data Manager that exposes the ERC1155 functionality where each token ID can be treated as an individual ERC20 token through the use of the `MinimalisticERC20FractionDataManager.sol`.

To be able to do this, the `MinimalisticERC1155WithERC20FractionsDataManager.sol` contract uses the `MinimalisticFungibleFractionsDO.sol` Data Object which stores the necessary information to manage the id, balances and total supply of the tokens.

## 🚀 **4. How to Set Up**

### _This repository requires some familiarity with:_

- [Solidity](https://docs.soliditylang.org/en/latest/)
- [yarn](https://yarnpkg.com/getting-started)
- [TypeScript](https://www.typescriptlang.org/)
- [hardhat](https://hardhat.org/)
- [ethers.js](https://docs.ethers.io/v5/)

### 4.1. Clone the repository

```
git clone git@github.com:NexeraProtocol/Minimalistic-Data-Index.git
```

### 4.2. Install dependencies

```
yarn & yarn install
```

### 4.3. Build contracts

```
yarn build
```

## ✨ **5. Deploying and set up contracts**

### 5.1. Deploy core contracts (Data Index and Data Point Registry)

```
yarn deploy:core --network <network>
```

### 5.2. Deploy Data Objects and Data Managers

To deploy the examples, the associated data point and metadata must first be set in the [constants.ts](./utils/constants.ts) file.
To create a new data point see [Allocate data point](#allocate-data-point).

```
yarn deploy:examples --network <network>
```

After deploying the contracts, the Data Manager must be allowed to manage the information associated to the data point in the Data Object by calling the `allowDataManager` function in the Data Index contract. Then the Data Index implementation must be set and linked to the data point in the Data Object by calling the `setDataIndexImplementation` function in the Data Object contract.

---

Until this point most of the Data Managers are ready to be used, but in this implementation the `MinimalisticERC1155WithERC20FractionsDataManager.sol` contract needs to be admin of the data point to be able to allow the `MinimalisticERC20FractionDataManager.sol` contract to manage the data point when they are deployed. To do this the `MinimalisticERC1155WithERC20FractionsDataManager.sol` contract must be admin of the data point calling the `grantAdminRole` function in the Data Point Registry contract.

The script [Set up Data Manager](#set-up-data-manager) can be used to execute the previous steps.

## 🛠 **6. Tests**

For running the tests, you will need to run this command :

```
yarn test
```

If you want to run linting or check the contracts size:

```
# Lint (Smart contracts)
yarn lint:contracts

# Lint (TS files)
yarn lint:ts

# Checking contracts size
yarn contract-size
```

## 📝 **7. Utility scripts**

### Allocate data point

```
yarn allocateDataPoint --network <network>
```

### Set up Data Manager

To set up the Data Manager the associated data point must first be set in the [constants.ts](./utils/constants.ts) file.

```
yarn setUpDataManager --network <network>
```

## 🤝 **8. Contributing**

Thank you for your interest in ERC-7208!

Please contact [EvergonLabs](https://www.evergonlabs.com) to integrate all your interactions with the project.

## 📜 **9. License**

Note: This component currently has dependencies that are licensed under the MIT license.

