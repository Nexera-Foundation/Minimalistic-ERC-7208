# **Minimalistic Data Index** <!-- omit in toc -->


- [1. What is Minimalistic](#🔬-What-is-Minimalistic)
- [2. Architecture](#🔬-Architecture)
- [3. Getting Started](#🔬-Getting-Started)
- [4. How to Set Up](#✨-How-to-SetUp)
- [5. Tests](#🛠-Tests)
- [6. Contributing](#🛠-Contributing)
- [7. License](#✨-License)


## 🔬 **1. What is Minimalistic**
This repository contains a simple, educational purpose implementation following Onchain Data Index (ERC-7208).
Please, do not use this example for production, if you want to implement ERC-7208 go to [Contributing](#🛠-Contributing) or contact [EvergonLabs]().

## 🔬 **2. Architecture**

### 2.1. Naming conventionn
DP - DataPoint.

DPR - DataPoint Registry.

DI / ODI  - Data Indexer

DM - Data Manager

DO - Data Object

### 2.2. Folder structuer

## ✨ **3. How to Set Up**

### _This repository requires some familiarity with:_

- [Solidity](https://docs.soliditylang.org/en/latest/)
- [yarn](https://yarnpkg.com/getting-started)
- [TypeScript](https://www.typescriptlang.org/)
- [hardhat](https://hardhat.org/)
- [ethers.js](https://docs.ethers.io/v5/)

### 3.1. Add environments variables

- Create a GITHUB_TOKEN on your offical Github Account under `Developer Settings` > `Personal Access Tokens` > `Tokens (classic)`. And generate a token with all permissions except deleting repos.
- Add it as environment varibale for your local machine:

```
source GITHUB_TOKEN=your_personal_token
```

### 3.2. Install dependencies

```
yarn & yarn install
```

### 3.3. Build contracts

```
yarn build
```

## 🔬 **4. Tests**

For running the tests, you will need to run this command :

```
yarn test
```

---

:warning: Make sure you have a .npmrc file in your root directory

```
#.npmrc
registry=https://registry.yarnpkg.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@nexeraprotocol:registry=https://npm.pkg.github.com
always-auth=true
```

:warning: Make sure you have a .yarnrc.yaml file in your root directory

```
nodeLinker: node-modules
npmScopes:
  nexeraprotocol:
    npmRegistryServer: "https://npm.pkg.github.com"
    npmAuthToken: "${GITHUB_TOKEN}"

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

## 🔬 **5. Contributing**

## 🔬 **6. License**