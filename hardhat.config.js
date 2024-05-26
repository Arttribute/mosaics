require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */


const galadrielDevnet = ["19daf05aeaceeac68736f22cffeb780f59a892c94eba0a5227f465429b086428"]

module.exports = {
  solidity: "0.8.24",
  networks: {
    galadriel: {
    chainId: 696969,
    url: "https://devnet.galadriel.com/",
    accounts: galadrielDevnet,
  },
},
};
