/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@openzeppelin/hardhat-upgrades");
// require("hardhat-contract-sizer");
// require("solidity-coverage");
// require("hardhat-gas-reporter");
import { getEnv } from './src/env';

console.log("ololo", getEnv('REACT_APP_CeloTest_URL'));
module.exports = {
  networks: {
    mumbai: {
      url: getEnv('REACT_APP_MUMBAI_URL'),
      accounts: [getEnv('REACT_APP_PRIV_KEY')],
    },
    celoTestnet: {
      url: getEnv('REACT_APP_CeloTest_URL'),
      accounts: [getEnv('REACT_APP_PRIV_KEY')],
    },
    AuroraTestnet: {
      url: getEnv('REACT_APP_AuroraTest_URL'),
      accounts: [getEnv('REACT_APP_PRIV_KEY')],
    },
    AvaxTestnet: {
      url: getEnv('REACT_APP_AvaxTest_URL'),
      accounts: [getEnv('REACT_APP_PRIV_KEY')],
    },
    Avax: {
      url: getEnv('REACT_APP_AVAX_URL'),
      accounts: [getEnv('REACT_APP_PRIV_KEY')],
    },
    polygon: {
      url: getEnv('REACT_APP_POLYGON_URL'),
      accounts: [getEnv('REACT_APP_PRIV_KEY')],
    },
    celo: {
      url: getEnv('REACT_APP_CELO_URL'),
      accounts: [getEnv('REACT_APP_PRIV_KEY')],
    },
    aurora: {
      url: getEnv('REACT_APP_AURORA_URL'),
      accounts: [getEnv('REACT_APP_PRIV_KEY')],
      chainId: 1313161554,
    },
    arbitrum: {
      url: getEnv('REACT_APP_ARBITRUM_URL'),
      accounts: [getEnv('REACT_APP_PRIV_KEY')],
      chainId: 42161,
    },
    arbitrumGoerli: {
      url: getEnv('REACT_APP_ArbitrumTest_UR'),
      accounts: [getEnv('REACT_APP_PRIV_KEY')],
      chainId: 421613,
    },
    optimismGoerli: {
      url: getEnv('REACT_APP_OptimismTest_URL'),
      accounts: [getEnv('REACT_APP_PRIV_KEY')],
      chainId: 420,
    },
    optimism: {
      url: getEnv('REACT_APP_OPTIMISM_URL'),
      accounts: [getEnv('REACT_APP_PRIV_KEY')],
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
