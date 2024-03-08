import React, { useState, useEffect } from "react";
import CircomEditor from "../components/CircomEditor";
import ContractDeployer from "../components/ContractDeployer";
import Dashboard from "../components/Dashbroad";
import { VStack } from "@chakra-ui/react";
import ContractInteraction from "../components/ContractInteraction";

const CircomEditorPage = () => {
  return (
    <VStack spacing={4} margin="20px" color="ethereum.800">
      <CircomEditor />
      <ContractDeployer />
      <Dashboard />
      <ContractInteraction />

      {/* Parse Error Dialog */}
    </VStack>
  );
};

export default CircomEditorPage;
