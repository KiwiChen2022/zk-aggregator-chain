import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Text, VStack, Badge } from "@chakra-ui/react";
import axios from "axios";

const Dashboard = () => {
  const contractInteraction = useSelector((state) => state.contractInteraction);

  const [gasFees, setGasFees] = useState(null);

  const fetchGasFees = async () => {
    const Auth = btoa(
      `${process.env.REACT_APP_INFURA_API_KEY}:${process.env.REACT_APP_INFURA_API_KEY_SECRET}`
    );

    try {
      const { data } = await axios.get(
        `https://gas.api.infura.io/networks/1/suggestedGasFees`, // Ethereum Mainnet
        {
          headers: { Authorization: `Basic ${Auth}` },
        }
      );
      setGasFees(data);
    } catch (error) {
      console.error("Error fetching gas fees:", error);
    }
  };

  useEffect(() => {
    fetchGasFees();
  }, []);

  return (
    <VStack
      spacing={4}
      align="stretch"
      bg="gray.200"
      p={4}
      borderRadius="md"
      border="1px"
      borderColor="gray.300"
    >
      <Text fontSize="xl" fontWeight="bold" color="gray.700">
        TransactionTracker
      </Text>
      <Box p="4" boxShadow="md" borderRadius="lg" bg="white">
        <Text>
          <strong>Chain Name:</strong> {contractInteraction.chainName}
        </Text>
        <Text>
          <strong>Chain ID:</strong> {contractInteraction.chainId}
        </Text>
        <Text>
          <strong>Operation:</strong> {contractInteraction.operationName}
        </Text>
        <Text>
          <strong>Transaction Hash:</strong>{" "}
          {contractInteraction.transactionHash}
        </Text>
        <Text>
          <strong>Contract Address:</strong>{" "}
          {contractInteraction.contractAddress}
        </Text>
        <Text>
          <strong>Gas Used:</strong> {contractInteraction.gasUsed}
        </Text>

        <Text fontSize="md" fontWeight="bold">
          Gas Price on ZKA Chain:
        </Text>
        <Text fontSize="md" fontWeight="bold">
          <Badge colorScheme="green" fontSize="0.8em">
            {contractInteraction.gasPrice} Gwei
          </Badge>
        </Text>
        <Text fontSize="md" fontWeight="bold">
          Total Cost on ZKA Chain:
        </Text>
        <Text fontSize="md" fontWeight="bold">
          <Badge colorScheme="green" fontSize="0.8em">
            {contractInteraction.totalCost} ETH
          </Badge>
        </Text>
        {gasFees && (
          <Box>
            <Text fontSize="md" fontWeight="bold">
              Gas Price on Mainnet:
            </Text>
            <Text fontSize="md" fontWeight="bold">
              <Badge colorScheme="red" fontSize="0.8em">
                {gasFees.medium.suggestedMaxFeePerGas} Gwei
              </Badge>
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Estimated Cost on Mainnet:
            </Text>
            <Text fontSize="md" fontWeight="bold">
              <Badge colorScheme="red" fontSize="0.8em">
                {(contractInteraction.gasUsed *
                  gasFees.medium.suggestedMaxFeePerGas) /
                  1e9}{" "}
                ETH
              </Badge>
            </Text>
          </Box>
        )}
      </Box>
    </VStack>
  );
};

export default Dashboard;
