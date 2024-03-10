import React, { useState } from "react";
import { useEthereum } from "../contexts/EthereumContext";
import { ethers } from "ethers";
import { Button, Text, useToast, Box } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setContractInteractionInfo } from "../features/contract/contractInteractionSlice";

const ContractDeployer = () => {
  const { account, signer, connect, _: ethereumError } = useEthereum();

  const toast = useToast();
  const dispatch = useDispatch();
  const {
    abi,
    bytecode,
    status,
    _: contractDataError,
  } = useSelector((state) => state.contractData);

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
      const contractWithTx = await factory.deploy(); // constructor arguments, if any
      const txReceipt = await contractWithTx.deployTransaction.wait();

      toast({
        title: "Deploying",
        description: "Deploying... Please wait.",
        status: "info",
        duration: 9000,
        isClosable: true,
      });

      const gasUsed = txReceipt.gasUsed;
      const tx = await signer.provider.getTransaction(
        txReceipt.transactionHash
      );
      const gasPrice = tx.gasPrice;
      const totalGasCost = gasUsed.mul(gasPrice);

      const network = await signer.provider.getNetwork();
      const chainId = network.chainId;
      const chainName = network.name ? network.name : `Chain ID: ${chainId}`; // in case no name

      const transactionHash = txReceipt.transactionHash;

      dispatch(
        setContractInteractionInfo({
          chainName: chainName,
          chainId: chainId,
          operationName: "Deploy Contract",
          transactionHash: transactionHash,
          contractAddress: contractWithTx.address,
          gasUsed: gasUsed.toString(),
          gasPrice: ethers.utils.formatUnits(gasPrice, "gwei"),
          totalCost: ethers.utils.formatEther(totalGasCost),
        })
      );

      toast({
        title: "Contract Deployment Successful",
        description: `Contract deployed at ${
          contractWithTx.address
        }. Gas Details: Used - ${gasUsed.toString()} units, Price - ${ethers.utils.formatUnits(
          gasPrice,
          "gwei"
        )} Gwei, Total Cost - ${ethers.utils.formatEther(totalGasCost)} ETH.`,
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
        Deploy The Pre-compiled Contract
      </Button>
      {ethereumError && (
        <Text color="red.500" mt="4">
          {ethereumError}
        </Text>
      )}
    </Box>
  );
};

export default ContractDeployer;
