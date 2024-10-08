const networks: any = {
  localhost: {
    chainId: 31337,
    url: "http://127.0.0.1:8545",
    allowUnlimitedContractSize: true,
    timeout: 1000 * 60,
    accounts: {
      mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
    },
  },
  hardhat: {
    live: false,
    allowUnlimitedContractSize: true,
    tags: ["test", "local"],
    saveDeployments: true,
  },
  amoy: {
    live: true,
    chainId: 80002,
    url: "https://rpc.ankr.com/polygon_amoy",
    accounts: {
      mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
    },
    allowUnlimitedContractSize: false,
    timeout: 1000 * 60,
  },
  polygon: {
    live: true,
    chainId: 137,
    url: process.env.ALCHEMY_KEY
      ? `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
      : "https://polygon.llamarpc.com",
    accounts: {
      mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
    },
    allowUnlimitedContractSize: false,
    timeout: 1000 * 60,
  },
  sepolia: {
    live: true,
    chainId: 11155111,
    url: "https://ethereum-sepolia.publicnode.com",
    accounts: {
      mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
    },
    allowUnlimitedContractSize: false,
    timeout: 1000 * 60,
    tags: ["eth-testnet"],
  },
  ethereum: {
    live: true,
    chainId: 1,
    url: process.env.ALCHEMY_KEY
      ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
      : "https://eth.llamarpc.com",
    accounts: {
      mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
    },
    allowUnlimitedContractSize: false,
    timeout: 1000 * 60,
  },
  fuji: {
    live: true,
    chainId: 43113,
    url: "https://api.avax-test.network/ext/bc/C/rpc",
    accounts: {
      mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
    },
    allowUnlimitedContractSize: false,
    timeout: 1000 * 60,
    tags: ["avax-testnet"],
  },
  avalanche: {
    live: true,
    chainId: 43114,
    url: "https://avalanche-c-chain.publicnode.com",
    accounts: {
      mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
    },
    allowUnlimitedContractSize: false,
    timeout: 1000 * 60,
  },
  bscTest: {
    live: true,
    chainId: 97,
    url: "https://data-seed-prebsc-1-s1.binance.org:8545",
    accounts: {
      mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
    },
    allowUnlimitedContractSize: false,
    timeout: 1000 * 60,
  },
  bsc: {
    live: true,
    chainId: 56,
    url: "https://bsc-dataseed.binance.org",
    accounts: {
      mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
    },
    allowUnlimitedContractSize: false,
    timeout: 1000 * 60,
  },
  arbitrumSepolia: {
    live: true,
    chainId: 421614,
    url: "https://arb-sepolia.g.alchemy.com/v2/1IRIZl4juWMRIGU-TojElUVeCRHsPSSv",
    accounts: {
      mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
    },
    allowUnlimitedContractSize: false,
    timeout: 1000 * 60,
  },
  arbitrumOne: {
    live: true,
    chainId: 42161,
    url: "https://arbitrum-one.public.blastapi.io",
    accounts: {
      mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
    },
    allowUnlimitedContractSize: false,
    timeout: 1000 * 60,
  },
  tenderly: {
    url: process.env.TENDERLY_RPC ? process.env.TENDERLY_RPC : "",
  },
};

export default networks;
