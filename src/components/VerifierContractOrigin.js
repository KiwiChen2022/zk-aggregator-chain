import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ethers } from "ethers";
import { useEthereum } from "../contexts/EthereumContext";
import { Button, Text, VStack, Alert, AlertIcon } from "@chakra-ui/react";
import { setContractInteractionInfo } from "../features/contract/contractInteractionSlice";

const VerifierContractOrigin = () => {
  const dispatch = useDispatch();
  const { signer } = useEthereum();
  const { contractAddress } = useSelector((state) => state.contractInteraction);
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

      // test
      // const transactionResponse = await contract.verifyProof(
      //   jsonCalldata[0],
      //   jsonCalldata[1],
      //   jsonCalldata[2],
      //   jsonCalldata[3]
      // );
      // await transactionResponse.wait();

      // const txReceipt = await signer.provider.getTransactionReceipt(
      //   transactionResponse.hash
      // );
      // const tx = await signer.provider.getTransaction(transactionResponse.hash);
      // const gasUsed = txReceipt.gasUsed;
      // const gasPrice = tx.gasPrice;
      // const totalGasCost = gasUsed.mul(gasPrice);

      // const network = await signer.provider.getNetwork();
      // const chainId = network.chainId;
      // const chainName = network.name ? network.name : `Chain ID: ${chainId}`;

      // update dashboard
      // dispatch(
      //   setContractInteractionInfo({
      //     operationName: "Verify Proof",
      //     chainName: chainName,
      //     chainId: chainId,
      //     transactionHash: transactionResponse.hash,
      //     gasUsed: gasUsed.toString(),
      //     gasPrice: ethers.utils.formatUnits(gasPrice, "gwei"),
      //     totalCost: ethers.utils.formatEther(totalGasCost),
      //   })
      // );

      // update Verification result

      // const contractInterface = new ethers.utils.Interface(abi);
      // const event = txReceipt.logs
      //   .map((log) => contractInterface.parseLog(log))
      //   .find((log) => log.name === "VerificationResult");

      // if (event) {
      //   const result = event.args.result;
      //   console.log("Verification result:", result);
      //   console.log("Event", event);
      //   setVerificationResult(result);
      // } else {
      //   console.log("VerificationResult event not found.");
      // }

      // console.log(transactionResponse);
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

export default VerifierContractOrigin;
