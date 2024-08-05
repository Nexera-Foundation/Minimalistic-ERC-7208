# **Minimalistic Data Index** <!-- omit in toc -->

---

- [1. How to Set Up](#🔬-setup)
- [2. Usage](#🛠-usage)
- [3. For Devs](#✨-deploying-contracts)

# 🚀 **Data Index**

## Implementing Data Objects under ERC-7208

## 🔬 **Setup**

### _This repository requires some familiarity with:_

- [Solidity](https://docs.soliditylang.org/en/latest/)
- [yarn](https://yarnpkg.com/getting-started)
- [TypeScript](https://www.typescriptlang.org/)
- [hardhat](https://hardhat.org/)
- [ethers.js](https://docs.ethers.io/v5/)
- [Foundry](https://book.getfoundry.sh)

### 1. Add environments variables

- Create a GITHUB_TOKEN on your offical Github Account under `Developer Settings` > `Personal Access Tokens` > `Tokens (classic)`. And generate a token with all permissions except deleting repos.
- Add it as environment varibale for your local machine:

```
source GITHUB_TOKEN=your_personal_token
```

### 2. Install dependencies

```
yarn & yarn install
```

### 3. Build contracts

```
yarn build
```

## 4. Tests

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

## ✨ **Deploying contracts**

...TBD...

## ✉️ **Development guidelines**

For best practices and guidelines, read more [here](https://allianceblock.io/).
