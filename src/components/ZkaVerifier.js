import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEthereum } from "../contexts/EthereumContext";
import {
  ZkProofAggregator,
  VerifierMock,
  VerifierMock__factory,
} from "zkproofaggregator-sdk";
import { Button, Text, Box, useToast, VStack } from "@chakra-ui/react";
import { ethers } from "ethers";
import { setContractInteractionInfo } from "../features/contract/contractInteractionSlice";

const ZkaVerifier = () => {
  const dispatch = useDispatch();
  const { account, provider, signer, connect, error } = useEthereum();
  const contractInteractionInfo = useSelector(
    (state) => state.contractInteraction
  );
  const [deploying, setDeploying] = useState(false);
  const toast = useToast();
  const [verifying, setVerifying] = useState(false);
  const { proof, publicSignals } = useSelector((state) => state.circom);
  const { abi } = useSelector((state) => state.contractData);

  const deployZKAVerifier = async () => {
    if (!signer) {
      toast({
        title: "Error",
        description: "Ethereum context is not loaded.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    setDeploying(true);
    try {
      const zkaFactoryAddress = process.env.REACT_APP_ZKA_FACTORY_ADDRESS;
      const zkpproofAggregator = new ZkProofAggregator(
        signer,
        zkaFactoryAddress
      );

      let plonk2MockVerifier = await new VerifierMock__factory(signer).deploy();

      const zkpVerifierName = "HALO2";
      const url = "http://localhost:3000";
      const deployer = await zkpproofAggregator.getConfig().signer.getAddress();
      console.log(contractInteractionInfo.contractAddress);
      const { tx, computeZKAVerifierAddress } =
        await zkpproofAggregator.deployZKAVerifier(
          zkpVerifierName,
          url,
          deployer,
          // contractInteractionInfo.contractAddress
          await plonk2MockVerifier.getAddress()
        );
      await tx.wait();
      console.log(tx);
      // const tx2 = await signer.provider.getTransactionReceipt(tx.hash);
      // console.log(tx2);
      toast({
        title: "Deployment Successful",
        description: `Deployed at: ${computeZKAVerifierAddress}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: "!!!Deployment Failed",
        description: `Error: ${e.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setDeploying(false);
    }
  };

  const verifyZKProof = async () => {
    if (!signer) {
      toast({
        title: "Error",
        description: "Ethereum context is not loaded.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    setVerifying(true);
    try {
      console.log("I am here!");
      const zkaFactoryAddress = process.env.REACT_APP_ZKA_FACTORY_ADDRESS;
      const zkpproofAggregator = new ZkProofAggregator(
        signer,
        zkaFactoryAddress
      );
      console.log("I am here!!");
      // const parsedProof = JSON.parse(proof);
      // const parsedPublicSignals = JSON.parse(publicSignals);
      // const rawCallData = await window.snarkjs.groth16.exportSolidityCallData(
      //   parsedProof,
      //   parsedPublicSignals
      // );

      // let jsonCallData = JSON.parse("[" + rawCallData + "]");
      // //   let zka_proof = abi.encodeWithSignature;

      // //   const encodedData = ethers.utils.defaultAbiCoder.encode(
      // //     ["uint256[2]", "uint256[2][2]", "uint256[2]", "uint256[1]"],
      // //     [jsonCallData[0], jsonCallData[1], jsonCallData[2], jsonCallData[3]]
      // //   );

      // const iface = new ethers.utils.Interface([
      //   "function verifyProof(uint256[2], uint256[2][2], uint256[2], uint256[1])",
      // ]);
      // const encodedData = iface.encodeFunctionData("verifyProof", [
      //   jsonCallData[0],
      //   jsonCallData[1],
      //   jsonCallData[2],
      //   jsonCallData[3],
      // ]);

      // let plonk2MockVerifier = await new VerifierMock__factory(signer).deploy();

      // let plonk2MockVerifier =
      //   await mock_proof_factory.deploymentTransaction.wait();

      // let proofMock = await plonk2MockVerifier.getVerifyCalldata("for test");
      let proofMock =
        "0x8e760afe000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000570726f6f660000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008666f722074657374000000000000000000000000000000000000000000000000";
      console.log(zkpproofAggregator);
      // const zkpVerifierAddress = await zkpproofAggregator.fetchVerifiersMeta();
      console.log("I am here!!!");

      // const currentVerifier = zkpVerifierAddress[0].verifierAddress;

      // console.log(proofMock);
      // console.log("currentVerifier: ", currentVerifier);
      console.log(zkpproofAggregator.getConfig());

      const tx = await zkpproofAggregator.zkpVerify(
        process.env.REACT_APP_ZKP_VERIFIER_ADDRESS,
        // currentVerifier,
        proofMock
      );
      console.log("I am here!!!!");
      const txReceipt = await tx.wait();
      console.log("tx:", tx);
      console.log("receipt: ", txReceipt);
      const gasUsed = txReceipt.gasUsed;

      const gasPrice = txReceipt.gasPrice;
      const totalGasCost = gasUsed * gasPrice;
      const network = await provider.getNetwork();
      console.log(network);
      const chainId = network.chainId.toString();
      const chainName = network.name ? network.name : `Chain ID: ${chainId}`; // in case no name

      const transactionHash = txReceipt.hash;

      dispatch(
        setContractInteractionInfo({
          chainName: chainName,
          chainId: chainId,
          operationName: "zkpVerify",
          transactionHash: transactionHash,
          contractAddress: tx.to,
          gasUsed: gasUsed.toString(),
          gasPrice: ethers.formatUnits(gasPrice, "gwei"),
          totalCost: ethers.formatEther(totalGasCost),
        })
      );

      toast({
        title: "Verification Successful",
        description: "The zkproof has been verified successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: "Verification Failed",
        description: `Error: ${e.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <VStack spacing={4} p={5}>
      {/* <Button
        onClick={deployZKAVerifier}
        isLoading={deploying}
        loadingText="Deploying..."
        colorScheme="blue"
      >
        Register ZKA Verifier
      </Button> */}

      <Button
        onClick={verifyZKProof}
        isLoading={verifying}
        loadingText="Verifying..."
        colorScheme="green"
      >
        Verify ZKProof
      </Button>
    </VStack>
  );
};

export default ZkaVerifier;
