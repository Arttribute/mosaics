require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: __dirname + "/.env.local" });

const privateKey = process.env.PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.24",
  networks: {
    galadriel: {
      chainId: 696969,
      url: "https://devnet.galadriel.com/",
      accounts: [privateKey],
    },
    sepolia: {
      chainId: 11155111,
      url: "https://sepolia.infura.io/v3/",
      accounts: [privateKey],
      gasPrice: 5189860000,
    },
    calibration: {
      chainId: 314159,
      url: "https://api.calibration.node.glif.io/rpc/v1",
      accounts: [privateKey],
    },
  },
};
