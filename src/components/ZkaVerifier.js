import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useEthereum } from "../contexts/EthereumContext";
import {
  ZkProofAggregator,
  VerifierMock,
  VerifierMock__factory,
} from "zkproofaggregator-sdk";
import { Button, Text, Box, useToast, VStack } from "@chakra-ui/react";
import { ethers } from "ethers";

const ZkaVerifier = () => {
  const { signer } = useEthereum();
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

      //   let plonk2MockVerifier = await new VerifierMock__factory(signer).deploy();

      const zkpVerifierName = "PLONKY2";
      const url = "http://localhost:3000";
      const deployer = await zkpproofAggregator.getConfig().signer.getAddress();
      const { tx, computeZKAVerifierAddress } =
        await zkpproofAggregator.deployZKAVerifier(
          zkpVerifierName,
          url,
          deployer,
          contractInteractionInfo.contractAddress
          //   await plonk2MockVerifier.getAddress()
        );
      await tx.wait();
      toast({
        title: "Deployment Successful",
        description: `Deployed at: ${computeZKAVerifierAddress}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: "Deployment Failed",
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
      const zkaFactoryAddress = process.env.REACT_APP_ZKA_FACTORY_ADDRESS;
      const zkpproofAggregator = new ZkProofAggregator(
        signer,
        zkaFactoryAddress
      );
      const zkpVerifierAddress = await zkpproofAggregator.fetchVerifiersMeta();
      const currentVerifier = zkpVerifierAddress.verifierAddress;

      const parsedProof = JSON.parse(proof);
      const parsedPublicSignals = JSON.parse(publicSignals);
      const rawCallData = await window.snarkjs.groth16.exportSolidityCallData(
        parsedProof,
        parsedPublicSignals
      );

      let jsonCallData = JSON.parse("[" + rawCallData + "]");
      //   let zka_proof = abi.encodeWithSignature;

      //   const encodedData = ethers.utils.defaultAbiCoder.encode(
      //     ["uint256[2]", "uint256[2][2]", "uint256[2]", "uint256[1]"],
      //     [jsonCallData[0], jsonCallData[1], jsonCallData[2], jsonCallData[3]]
      //   );

      const iface = new ethers.utils.Interface([
        "function verifyProof(uint256[2], uint256[2][2], uint256[2], uint256[1])",
      ]);
      const encodedData = iface.encodeFunctionData("verifyProof", [
        jsonCallData[0],
        jsonCallData[1],
        jsonCallData[2],
        jsonCallData[3],
      ]);
      const tx = await zkpproofAggregator.zkpVerify(
        "0xdB73d57180eB64d885060061d9411c904304720B",
        // currentVerifier,
        encodedData
      );
      await tx.wait();
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
      <Button
        onClick={deployZKAVerifier}
        isLoading={deploying}
        loadingText="Deploying..."
        colorScheme="blue"
      >
        Deploy ZKA Verifier
      </Button>

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
