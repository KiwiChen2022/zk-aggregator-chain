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
      <Text fontSize="2xl" fontWeight="bold" color="gray.700">
        TransactionTracker
      </Text>
      <Box p="4" boxShadow="md" borderRadius="lg" bg="white">
        <Text fontSize="lg">
          <strong>Chain Name:</strong> {contractInteraction.chainName}
        </Text>
        <Text fontSize="lg">
          <strong>Chain ID:</strong> {contractInteraction.chainId}
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          Operation:
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          <Badge colorScheme="purple" fontSize="1em">
            {contractInteraction.operationName}
          </Badge>
        </Text>
        {/* <Text>
          <strong>Operation:</strong> {contractInteraction.operationName}
        </Text> */}
        <Text fontSize="lg">
          <strong>Transaction Hash:</strong>{" "}
          {contractInteraction.transactionHash}
        </Text>
        <Text fontSize="lg">
          <strong>Contract Address:</strong>{" "}
          {contractInteraction.contractAddress}
        </Text>
        <Text fontSize="lg">
          <strong>Gas Used:</strong> {contractInteraction.gasUsed}
        </Text>

        <Text fontSize="lg" fontWeight="bold">
          Gas Price on ZKA Chain:
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          <Badge colorScheme="green" fontSize="1em">
            {contractInteraction.gasPrice} Gwei
          </Badge>
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          Total Cost on ZKA Chain:
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          <Badge colorScheme="green" fontSize="1em">
            {contractInteraction.totalCost} ETH
          </Badge>
        </Text>
        {gasFees && (
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              Gas Price on Mainnet:
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              <Badge colorScheme="red" fontSize="1em">
                {gasFees.medium.suggestedMaxFeePerGas} Gwei
              </Badge>
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              Estimated Cost on Mainnet:
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              <Badge colorScheme="red" fontSize="1em">
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
