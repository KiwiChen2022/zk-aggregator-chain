import React from "react";
import { useSelector } from "react-redux";
import { Box, Text, VStack } from "@chakra-ui/react";

const Dashboard = () => {
  const contractInteraction = useSelector((state) => state.contractInteraction);

  return (
    <VStack spacing={4} align="stretch">
      <Box p="4" boxShadow="md">
        <Text>Chain Name: {contractInteraction.chainName}</Text>
        <Text>Chain ID: {contractInteraction.chainId}</Text>
        <Text>Operation Name: {contractInteraction.operationName}</Text>
        <Text>Transaction Hash: {contractInteraction.transactionHash}</Text>
        <Text>Contract Address: {contractInteraction.contractAddress}</Text>
        <Text>Gas Used: {contractInteraction.gasUsed}</Text>
        <Text>Gas Price: {contractInteraction.gasPrice} Gwei</Text>
        <Text>Total Cost: {contractInteraction.totalCost} ETH</Text>
      </Box>
    </VStack>
  );
};

export default Dashboard;
