const { ethers } = require("hardhat");
const {
  ZkProofAggregator,
  VerifierMock__factory,
  VerifierMock,
} = require("zkproofaggregator-sdk");

async function main() {
  // deploy zkpAggregator Contract
  const [deployer] = await ethers.getSigners();

  const zkProofAggregator = new ZkProofAggregator(deployer);

  await zkProofAggregator.deploy();

  const zkaState = zkProofAggregator.getConfig();

  console.log(zkaState);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
