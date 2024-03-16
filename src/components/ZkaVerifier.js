import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEthereum } from "../contexts/EthereumContext";
import { ZkProofAggregator } from "zkproofaggregator-sdk";
import {
  Button,
  Text,
  Box,
  useToast,
  VStack,
  Input,
  Tooltip,
  Divider,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { setContractInteractionInfo } from "../features/contract/contractInteractionSlice";

const ZkaVerifier = () => {
  const dispatch = useDispatch();
  const { account, provider, signer } = useEthereum();
  const contractInteractionInfo = useSelector(
    (state) => state.contractInteraction
  );
  const [deploying, setDeploying] = useState(false);
  const [currentVerifierAddress, setCurrentVerifierAddress] = useState("");

  const [zkDappName, setZkDappName] = useState("");
  const toast = useToast();
  const [verifying, setVerifying] = useState(false);
  const { proof, publicSignals } = useSelector((state) => state.circom);
  const { abi } = useSelector((state) => state.contractData);

  async function handleTransaction(tx, operationName) {
    const txReceipt = await tx.wait();

    const gasUsed = txReceipt.gasUsed;
    const gasPrice = txReceipt.gasPrice;
    const totalGasCost = gasUsed * gasPrice;
    const network = await provider.getNetwork();
    const chainId = network.chainId.toString();
    const chainName = network.name ? network.name : `Chain ID: ${chainId}`; // in case no name
    const transactionHash = txReceipt.hash;

    console.log(tx);
    dispatch(
      setContractInteractionInfo({
        chainName: chainName,
        chainId: chainId,
        operationName: operationName,
        transactionHash: transactionHash,
        contractAddress: tx.to,
        gasUsed: gasUsed.toString(),
        gasPrice: ethers.formatUnits(gasPrice, "gwei"),
        totalCost: ethers.formatEther(totalGasCost),
      })
    );
  }

  const deployZKAVerifier = async () => {
    if (!zkDappName.trim()) {
      toast({
        title: "Error",
        description: "ZKA DAPP name cannot be empty.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

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
      const zkpVerifierName = zkDappName;
      const url = "http://localhost:3000";
      // const deployer = await zkpproofAggregator.getConfig().signer.getAddress();
      const deployer = account;

      const { tx, computeZKAVerifierAddress } =
        await zkpproofAggregator.deployZKAVerifier(
          zkpVerifierName,
          url,
          deployer,
          contractInteractionInfo.contractAddress
        );

      await handleTransaction(tx, "register zk-dapp");

      setCurrentVerifierAddress(computeZKAVerifierAddress);
      toast({
        title: "Registration Successful",
        description: `Registered at: ${computeZKAVerifierAddress}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: "Registration Failed",
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
        description: "Ethereum context is not connected.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (!currentVerifierAddress) {
      toast({
        title: "Action not possible",
        description:
          "The ZKA Verifier address is not set. Please register the verifier contract first.",
        status: "warning",
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

      // encode the proof
      const parsedProof = JSON.parse(proof);
      const parsedPublicSignals = JSON.parse(publicSignals);
      const rawCallData = await window.snarkjs.groth16.exportSolidityCallData(
        parsedProof,
        parsedPublicSignals
      );
      let jsonCallData = JSON.parse("[" + rawCallData + "]");
      const iface = new ethers.Interface([
        "function verifyProof(uint256[2], uint256[2][2], uint256[2], uint256[1])",
      ]);
      const encodedData = iface.encodeFunctionData("verifyProof", [
        jsonCallData[0],
        jsonCallData[1],
        jsonCallData[2],
        jsonCallData[3],
      ]);

      // const zkpVerifierAddress = await zkpproofAggregator.fetchVerifiersMeta();
      // const currentVerifier = zkpVerifierAddress[0].verifierAddress;
      // console.log(zkpproofAggregator.getConfig());

      const currentVerifier = currentVerifierAddress;
      const tx = await zkpproofAggregator.zkpVerify(
        currentVerifier,
        encodedData
      );
      await handleTransaction(tx, "zkp Verify");

      const proofTimeStamp = await zkpproofAggregator.checkProofVerifyStatus(
        currentVerifier,
        encodedData
      );

      console.log("proofTimeStamp: ", proofTimeStamp);

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
      <Tooltip label="Enter a unique ZKA DAPP Name for Registration" hasArrow>
        <Input
          placeholder="Enter a unique ZKA DAPP Name for Registration"
          value={zkDappName}
          onChange={(e) => setZkDappName(e.target.value)}
          size="lg"
        />
      </Tooltip>

      <Button
        onClick={deployZKAVerifier}
        isLoading={deploying}
        loadingText="Deploying..."
        colorScheme="blue"
      >
        Register ZKA Verifier
      </Button>

      <Divider />
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
