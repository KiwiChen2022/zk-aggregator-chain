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

  // deploy circom example contract
  // const Verifier = await ethers.getContractFactory("Groth16Verifier", deployer);
  // const verifier = await Verifier.deploy();
  // let verifier_address = await verifier.getAddress();
  // console.log("circom Verifier address: ", verifier_address);

  // registre circom contract into zkpAggregator Contract verifiers list

  // const zkpVerifierName = "PLONK2";
  // const url = "http://localhost:3000";
  // let plonk2MockVerifier = await new VerifierMock__factory(deployer).deploy();
  // verifier_address = await plonk2MockVerifier.getAddress();
  // console.log("Mock Verifier address: ", verifier_address);
  // const deployer = await zkpproofAggregator.getConfig().signer.getAddress();
  // const { tx, computeZKAVerifierAddress } =
  //   await zkProofAggregator.deployZKAVerifier(
  //     zkpVerifierName,
  //     url,
  //     deployer,
  //     verifier_address
  //   );
  // await tx.wait();
  // console.log("zkpVerifierAddress: ", computeZKAVerifierAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
