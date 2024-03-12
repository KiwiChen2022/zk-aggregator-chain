import React, { useState, useEffect } from "react";
import CircomEditor from "../components/CircomEditor";
import ContractDeployer from "../components/ContractDeployer";
import Dashboard from "../components/Dashbroad";
import { VStack, Flex, Box } from "@chakra-ui/react";
import VerifierContractOrigin from "../components/VerifierContractOrigin";
import ZkaVerifier from "../components/ZkaVerifier";

const CircomEditorPage = () => {
  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      margin="20px"
      wrap="wrap"
      spacing={4}
      align="flex-start"
    >
      <VStack
        flex={1}
        minW="0"
        spacing={4}
        color="ethereum.800"
        borderLeft="2px solid"
        borderRight="2px solid"
        borderColor="gray.200"
      >
        <CircomEditor />
        <ContractDeployer />
        {/* <VerifierContractOrigin /> */}
        <ZkaVerifier />
      </VStack>
      <Box
        width={{ base: "100%", lg: "300px" }}
        flexShrink={0}
        height="fit-content"
        position="sticky"
        top="20px"
      >
        <Dashboard />
      </Box>
    </Flex>
  );
};

export default CircomEditorPage;
