import React, { useState } from "react";
import { useEthereum } from "../contexts/EthereumContext";
import { ethers } from "ethers";
import { Button, Text, useToast, Box } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setContractInteractionInfo } from "../features/contract/contractInteractionSlice";

const ContractDeployer = () => {
  const { account, signer, connect } = useEthereum();

  const toast = useToast();
  const dispatch = useDispatch();
  const { abi, bytecode, status } = useSelector((state) => state.contractData);

  const deployContract = async () => {
    if (!signer) {
      await connect(); // make sure MetaMask is connected
      if (!account) {
        toast({
          title: "Error",
          description: "No account connected",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
    }

    if (status !== "succeeded") {
      toast({
        title: "Error",
        description: "Verifier Contract data not ready.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      const factory = new ethers.ContractFactory(abi, bytecode, signer);
      const contractWithTx = await factory.deploy();
      const txReceipt = await contractWithTx.deploymentTransaction().wait();
      const contractAddress = await contractWithTx.getAddress();

      toast({
        title: "Deploying",
        description: "Deploying... Please wait.",
        status: "info",
        duration: 9000,
        isClosable: true,
      });

      // gas fee calculation
      const gasUsed = txReceipt.gasUsed;
      const gasPrice = txReceipt.gasPrice;
      const totalGasCost = gasUsed * gasPrice;

      const network = await signer.provider.getNetwork();
      const chainId = network.chainId.toString();
      const chainName = network.name ? network.name : `Chain ID: ${chainId}`; // in case no name

      const transactionHash = txReceipt.hash;

      dispatch(
        setContractInteractionInfo({
          chainName: chainName,
          chainId: chainId,
          operationName: "Deploy Contract",
          transactionHash: transactionHash,
          contractAddress: contractAddress,
          gasUsed: gasUsed.toString(),
          gasPrice: ethers.formatUnits(gasPrice, "gwei"),
          totalCost: ethers.formatEther(totalGasCost),
        })
      );

      toast({
        title: "Contract Deployment Successful",
        description: `Contract deployed at ${contractAddress}. Gas Details: Used - ${gasUsed.toString()} units, Price - ${ethers.formatUnits(
          gasPrice,
          "gwei"
        )} Gwei, Total Cost - ${ethers.formatEther(totalGasCost)} ETH.`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to deploy contract", error);
      toast({
        title: "Error",
        description: `Failed to deploy contract: ${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box padding="4" bg="ethereum.200" boxShadow="md" borderRadius="md">
      <Button colorScheme="blue" onClick={deployContract}>
        Deploy The Pre-compiled Circom Verifier Contract
      </Button>
    </Box>
  );
};

export default ContractDeployer;
