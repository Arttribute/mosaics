const hre = require("hardhat");
require("dotenv").config();

async function main() {
  if (!process.env.GALADRIEL_ORACLE_ADDRESS) {
    throw new Error("ORACLE_ADDRESS env variable is not set.");
  }
  const oracleAddress: string = process.env.GALADRIEL_ORACLE_ADDRESS;
  //await deployGameAgent(oracleAddress);
  await deployNFTContract();
  await deployStakingContract();
}

async function deployGameAgent(oracleAddress: string) {
  const agent = await hre.ethers.deployContract(
    "MosaicsGameAgent",
    [oracleAddress],
    {}
  );
  await agent.waitForDeployment();
  console.log(`MosaicsGameAgent contract deployed to ${agent.target}`);
}

async function deployNFTContract() {
  const mosaicsNFT = await hre.ethers.deployContract("MosaicsNFTReward");
  await mosaicsNFT.waitForDeployment();
  console.log(`MosaicsNFTReward contract deployed to ${mosaicsNFT.target}`);
}

async function deployStakingContract() {
  const playToEarn = await hre.ethers.deployContract("PlayToEarn");
  await playToEarn.waitForDeployment();
  console.log(`PlayToEarn contract deployed to ${playToEarn.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
