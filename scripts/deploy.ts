const hre = require("hardhat");
require("dotenv").config();

async function main() {
  if (!process.env.ORACLE_ADDRESS) {
    throw new Error("ORACLE_ADDRESS env variable is not set.");
  }
  const oracleAddress: string = process.env.ORACLE_ADDRESS;
  await deployTest(oracleAddress);
}

async function deployTest(oracleAddress: string) {
  const agent = await hre.ethers.deployContract(
    "MosaicsGameAgent",
    [oracleAddress],
    {}
  );

  await agent.waitForDeployment();
  console.log(`MosaicsGameAgent oracle address ${process.env.ORACLE_ADDRESS}`);
  console.log(`MosaicsGameAgent contract deployed to ${agent.target}`);
  console.log("MosaicsGameAgent contract address: ", await agent.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
