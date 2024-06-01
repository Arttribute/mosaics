const hre = require("hardhat");
require("dotenv").config();

async function main() {
  if (!process.env.GALADRIEL_ORACLE_ADDRESS) {
    throw new Error("ORACLE_ADDRESS env variable is not set.");
  }
  const oracleAddress: string = process.env.GALADRIEL_ORACLE_ADDRESS;
  await deployGameAgent(oracleAddress);
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

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
