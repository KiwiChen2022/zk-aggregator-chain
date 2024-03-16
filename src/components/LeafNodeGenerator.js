import React, { useState } from "react";
import { Button, Input, Box, Text } from "@chakra-ui/react";
import keccak256 from "keccak256";

const LeafNodeGenerator = () => {
  const [txHash, setTxHash] = useState("");
  const [callData, setCallData] = useState("");
  const [leafNode, setLeafNode] = useState("");

  const handleGenerateLeafNode = () => {
    const combinedInput = `${txHash}${callData}`;
    const leafNode = keccak256(combinedInput).toString("hex");
    setLeafNode(leafNode);
  };

  return (
    <Box>
      <Input
        placeholder="Enter tx hash"
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
        mb={4}
      />
      <Input
        placeholder="Enter call data"
        value={callData}
        onChange={(e) => setCallData(e.target.value)}
        mb={4}
      />
      <Button onClick={handleGenerateLeafNode} mb={4}>
        Generate Leaf Node
      </Button>
      {leafNode && <Text>Leaf Node: {leafNode}</Text>}
    </Box>
  );
};

export default LeafNodeGenerator;
