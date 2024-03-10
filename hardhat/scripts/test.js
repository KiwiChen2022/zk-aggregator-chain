const { ethers } = require("hardhat");
const { ZkProofAggregator } = require("zkproofaggregator-sdk");

async function main() {
  const [deployer] = await ethers.getSigners();

  const zkProofAggregator = new ZkProofAggregator(
    deployer,
    "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"
  );

  const zkaState = await zkProofAggregator.fetchVerifiersMeta();

  console.log(zkaState);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
