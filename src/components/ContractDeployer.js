import React, { useState, useEffect } from "react";
import { useEthereum } from "../contexts/EthereumContext";
import { ethers } from "ethers";
import { Button, Text, useToast, Box } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { setDeploymentInfo } from "../features/deployment/deploymentSlice";

const ContractDeployer = () => {
  const { account, signer, connect, error: ethereumError } = useEthereum();
  const [contractABI, setContractABI] = useState(null);
  const [contractBytecode, setContractBytecode] = useState(null);
  const toast = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    const url = `${process.env.PUBLIC_URL}/Groth16Verifier.json`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setContractABI(data.abi);
        setContractBytecode(data.bytecode);
      })
      .catch((error) => {
        console.error("Failed to load contract data", error);
        toast({
          title: "Error",
          description: "Failed to load contract data.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  }, []);

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

    try {
      const factory = new ethers.ContractFactory(
        contractABI,
        contractBytecode,
        signer
      );
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
        setDeploymentInfo({
          chainName: chainName,
          chainId: chainId,
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
