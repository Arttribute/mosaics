const hre = require("hardhat");

require ("dotenv").config()

async function main() {
  if (!process.env.ORACLE_ADDRESS) {
    throw new Error("ORACLE_ADDRESS env variable is not set.");
  }
  const oracleAddress: string = process.env.ORACLE_ADDRESS;
  await deployTest(oracleAddress);
}

async function deployTest(oracleAddress: string) {
  const agent = await hre.ethers.deployContract("ChatGpt", [oracleAddress], {});

  await agent.waitForDeployment();

  console.log(
    `ChatGPT contract deployed to ${agent.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});