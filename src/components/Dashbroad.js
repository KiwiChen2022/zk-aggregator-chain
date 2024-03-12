import React from "react";
import { useSelector } from "react-redux";
import { Box, Text, VStack, Badge } from "@chakra-ui/react";

const Dashboard = () => {
  const contractInteraction = useSelector((state) => state.contractInteraction);

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
        <Text>
          <strong>Gas Price:</strong> {contractInteraction.gasPrice} Gwei
        </Text>
        {/* Emphasize the Gas Cost */}
        <Text fontSize="md" fontWeight="bold">
          <strong>Total Cost:</strong>{" "}
          <Badge colorScheme="red" fontSize="0.8em">
            {contractInteraction.totalCost} ETH
          </Badge>
        </Text>
      </Box>
    </VStack>
  );
};

export default Dashboard;
