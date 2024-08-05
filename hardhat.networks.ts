const networks: any = {
  localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545",
      allowUnlimitedContractSize: true,
      timeout: 1000 * 60,
  },
  hardhat: {
      live: false,
      //forking: {url: process.env.ALCHMEMY_KEY ? `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}` : "https://rpc.ankr.com/polygon_mumbai",},
      allowUnlimitedContractSize: true,
      tags: ["test", "local"],
      //accounts: {mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : ""},
  },
  polygon_prod: {
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
  mumbai_dev: {
      live: true,
      chainId: 80001,
      url: process.env.ALCHMEMY_KEY ? `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}` : "https://rpc.ankr.com/polygon_mumbai",
      accounts: {
          mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
      },
      allowUnlimitedContractSize: false,
      timeout: 1000 * 60,
      tags: ["testnet"],
  },
  mumbai_stage: {
      live: true,
      chainId: 80001,
      url: process.env.ALCHMEMY_KEY ? `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}` : "https://rpc.ankr.com/polygon_mumbai",
      accounts: {
          mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
      },
      allowUnlimitedContractSize: false,
      timeout: 1000 * 60,
      tags: ["testnet"],
  },
  ethereum_prod: {
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
  sepolia_dev: {
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
  sepolia_stage: {
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
  avalanche_prod: {
      live: true,
      chainId: 43114,
      url: "https://avalanche-c-chain.publicnode.com",
      accounts: {
          mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
      },
      allowUnlimitedContractSize: false,
      timeout: 1000 * 60,
  },
  fuji_dev: {
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
  fuji_stage: {
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
  bsc_prod: {
      live: true,
      chainId: 56,
      url: "https://bsc-dataseed.binance.org",
      accounts: {
          mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
      },
      allowUnlimitedContractSize: false,
      timeout: 1000 * 60,
  },
  bscTest_dev: {
      live: true,
      chainId: 97,
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: {
          mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
      },
      allowUnlimitedContractSize: false,
      timeout: 1000 * 60,
  },
  bscTest_stage: {
      live: true,
      chainId: 97,
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: {
          mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
      },
      allowUnlimitedContractSize: false,
      timeout: 1000 * 60,
  },
  arbitrumOne_prod: {
      live: true,
      chainId: 42161,
      url: "https://arbitrum-one.public.blastapi.io",
      accounts: {
          mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
      },
      allowUnlimitedContractSize: false,
      timeout: 1000 * 60,
  },
  arbitrumSepolia_dev: {
      live: true,
      chainId: 421614,
      url: "https://arb-sepolia.g.alchemy.com/v2/1IRIZl4juWMRIGU-TojElUVeCRHsPSSv",
      accounts: {
          mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : "",
      },
      allowUnlimitedContractSize: false,
      timeout: 1000 * 60,
  },
  arbitrumSepolia_stage: {
      live: true,
      chainId: 421614,
      url: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
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