const { ethers } = require("hardhat");
const {
  ZkProofAggregator,
  VerifierMock__factory,
  VerifierMock,
} = require("zkproofaggregator-sdk");

async function main() {
  // deploy zkpAggregator Contract
  const [deployer] = await ethers.getSigners();

  // const zkProofAggregator = new ZkProofAggregator(deployer);

  // await zkProofAggregator.deploy();

  // const zkaState = zkProofAggregator.getConfig();

  // console.log(zkaState);

  const MerkleProof = await ethers.getContractFactory("MerkleProof");

  const merkleProof = await MerkleProof.deploy();

  console.log("SPVVerifier deployed to:", merkleProof.address);

  const setRootTx = await merkleProof.setRoot(
    "0x79547773244d9491f292f11f37541d383c92571f54a16aaf7822344bee3a5d8e"
  );

  await setRootTx.wait();

  console.log("MerkleRoot has been set.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
