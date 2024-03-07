import React from "react";
import { useSelector } from "react-redux";
import { Box, Text, VStack } from "@chakra-ui/react";

const Dashboard = () => {
  const deploymentInfo = useSelector((state) => state.deployment);

  return (
    <VStack spacing={4} align="stretch">
      <Box p="4" boxShadow="md">
        <Text>Chain Name: {deploymentInfo.chainName}</Text>
        <Text>Chain ID: {deploymentInfo.chainId}</Text>
        <Text>Transaction Hash: {deploymentInfo.transactionHash}</Text>
        <Text>Contract Address: {deploymentInfo.contractAddress}</Text>
        <Text>Gas Used: {deploymentInfo.gasUsed}</Text>
        <Text>Gas Price: {deploymentInfo.gasPrice} Gwei</Text>
        <Text>Total Cost: {deploymentInfo.totalCost} ETH</Text>
      </Box>
    </VStack>
  );
};

export default Dashboard;
