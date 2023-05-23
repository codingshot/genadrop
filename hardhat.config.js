/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@openzeppelin/hardhat-upgrades");
// require("hardhat-contract-sizer");
// require("solidity-coverage");
// require("hardhat-gas-reporter");

console.log("ololo", process.env.REACT_APP_POLYGON_URL);
module.exports = {
  networks: {
    mumbai: {
      url: process.env.REACT_APP_MUMBAI_URL,
      accounts: [process.env.REACT_APP_PRIV_KEY],
    },
    celoTestnet: {
      url: process.env.REACT_APP_CeloTest_URL,
      accounts: [process.env.REACT_APP_PRIV_KEY],
    },
    AuroraTestnet: {
      url: process.env.REACT_APP_AuroraTest_URL,
      accounts: [process.env.REACT_APP_PRIV_KEY],
    },
    AvaxTestnet: {
      url: process.env.REACT_APP_AvaxTest_URL,
      accounts: [process.env.REACT_APP_PRIV_KEY],
    },
    Avax: {
      url: process.env.REACT_APP_AVAX_URL,
      accounts: [process.env.REACT_APP_PRIV_KEY],
    },
    polygon: {
      url: process.env.REACT_APP_POLYGON_URL,
      accounts: [process.env.REACT_APP_PRIV_KEY],
    },
    celo: {
      url: process.env.REACT_APP_CELO_URL,
      accounts: [process.env.REACT_APP_PRIV_KEY],
    },
    aurora: {
      url: process.env.REACT_APP_AURORA_URL,
      accounts: [process.env.REACT_APP_PRIV_KEY],
      chainId: 1313161554,
    },
    arbitrum: {
      url: process.env.REACT_APP_ARBITRUM_URL,
      accounts: [process.env.REACT_APP_PRIV_KEY],
      chainId: 42161,
    },
    arbitrumGoerli: {
      url: process.env.REACT_APP_ArbitrumTest_URL,
      accounts: [process.env.REACT_APP_PRIV_KEY],
      chainId: 421613,
    },
    optimismGoerli: {
      url: process.env.REACT_APP_OptimismTest_URL,
      accounts: [process.env.REACT_APP_PRIV_KEY],
      chainId: 420,
    },
    optimism: {
      url: process.env.REACT_APP_OPTIMISM_URL,
      accounts: [process.env.REACT_APP_PRIV_KEY],
      chainId: 10,
    },
    hardhat: {
      forking: {
        // Using Alchemy
        url: "process.env.ALCHEMY",
      },
    },
    // mainnet: {
    //   chainId: 1,
    //   url: process.env.PROD_ALCHEMY_KEY,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 70000,
  },
};
