require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
module.exports = {
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainid: 31337,
      blockConfirmations: 1,
    },
    rinkeby: {
      chainid: 4,
      blockConfirmations: 6,
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  solidity: "0.8.7",
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
};
