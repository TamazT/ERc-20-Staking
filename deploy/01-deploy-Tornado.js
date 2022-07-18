const { getNamedAccounts, deployments, network, ethers } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  let chainId = network.config.chainId;
  log("----------------------------------------------------");
  log("Deploying Tornado and waiting for confirmations...");

  if ((chainId = 31337)) {
    const arguments = [100];
    const tornado = await deploy("Tornado", {
      from: deployer,
      args: arguments,
      log: true,
      // we need to wait if on a live network so we can verify properly
      waitConfirmations: network.config.blockConfirmations || 1,
    });
  } else {
    const arguments = [100];
    const tornado = await deploy("Tornado", {
      from: deployer,
      args: arguments,
      log: true,
      // we need to wait if on a live network so we can verify properly
      waitConfirmations: network.config.blockConfirmations || 1,
    });
    log(`Artwork deployed at ${Tornado.address}`);
    if (
      !developmentChains.includes(network.name) &&
      process.env.ETHERSCAN_API_KEY
    ) {
      await verify(Tornado.address, arguments);
    }
    //const chainId = network.config.chainId;
  }
};

module.exports.tags = ["all", "fundme"];
