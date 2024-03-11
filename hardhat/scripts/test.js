const { ethers } = require("hardhat");
const {
  ZkProofAggregator,
  VerifierMock__factory,
} = require("zkproofaggregator-sdk");

async function main() {
  const [deployer] = await ethers.getSigners();

  const zkProofAggregator = new ZkProofAggregator(
    deployer,
    "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"
  );

  const zkaState = await zkProofAggregator.fetchVerifiersMeta();

  console.log(zkaState);
  const currentVerifier = zkaState[0].verifierAddress;
  console.log("currentVerifier", currentVerifier);

  let proofMock =
    "0x8e760afe000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000570726f6f660000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008666f722074657374000000000000000000000000000000000000000000000000";
  // console.log(proofMock);

  const tx = await zkProofAggregator.zkpVerify(
    // process.env.REACT_APP_ZKP_VERIFIER_ADDRESS,
    currentVerifier,
    proofMock
  );

  const tx_receipt = await tx.wait();
  console.log(tx_receipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
