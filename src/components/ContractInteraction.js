import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { useEthereum } from "../contexts/EthereumContext";
import { Button, Text, VStack, Alert, AlertIcon } from "@chakra-ui/react";

const ContractInteraction = () => {
  const { signer } = useEthereum();
  const { contractAddress } = useSelector((state) => state.deployment);
  const { proof, publicSignals } = useSelector((state) => state.circom);
  const { abi } = useSelector((state) => state.contractData);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState("");

  const verifyProof = async () => {
    if (!contractAddress || !proof || !publicSignals.length || !signer) {
      setError("Missing data for contract interaction");
      return;
    }

    try {
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const parsedProof = JSON.parse(proof);
      const parsedpublicSignals = JSON.parse(publicSignals);
      const rawcalldata = await window.snarkjs.groth16.exportSolidityCallData(
        parsedProof,
        parsedpublicSignals
      );

      let jsonCalldata = JSON.parse("[" + rawcalldata + "]");

      const result = await contract.verifyProof(
        jsonCalldata[0],
        jsonCalldata[1],
        jsonCalldata[2],
        jsonCalldata[3]
      );
      setVerificationResult(result);
    } catch (err) {
      setError("Contract interaction failed: " + err.message);
    }
  };

  return (
    <VStack spacing={4}>
      <Button colorScheme="blue" onClick={verifyProof}>
        Verify Proof on Chain
      </Button>
      {error && (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}
      {verificationResult !== null && (
        <Alert status="success">
          <AlertIcon />
          Verification Result: {verificationResult.toString()}
        </Alert>
      )}
    </VStack>
  );
};

export default ContractInteraction;
