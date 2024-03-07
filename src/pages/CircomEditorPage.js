import React, { useState, useEffect } from "react";
import {
  Button,
  Text,
  Box,
  VStack,
  Code,
  useColorMode,
  Input,
  Textarea,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";

const CircomEditorPage = () => {
  const [proof, setProof] = useState("");
  const [result, setResult] = useState("");
  const { colorMode } = useColorMode();
  const [inputJson, setInputJson] = useState('{ "a": 3, "b": 11 }');
  const [circomCode, setCircomCode] = useState("");
  const [parseError, setParseError] = useState("");

  // Alert dialog hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/circuit.circom`)
      .then((res) => res.text())
      .then((text) => setCircomCode(text))
      .catch((err) => console.error("Failed to load circuit.circom", err));
  }, []);

  const calculateProof = async () => {
    let inputData;
    try {
      inputData = JSON.parse(inputJson);
    } catch (error) {
      setParseError(error.toString());
      onOpen();
      return;
    }

    const circuitWasmPath = `${process.env.PUBLIC_URL}/circuit.wasm`;
    const circuitZkeyPath = `${process.env.PUBLIC_URL}/circuit_final.zkey`;
    const verificationKeyPath = `${process.env.PUBLIC_URL}/verification_key.json`;

    const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
      inputData,
      circuitWasmPath,
      circuitZkeyPath
    );

    setProof(JSON.stringify(proof, null, 2));

    const vkey = await fetch(verificationKeyPath).then((res) => res.json());

    const res = await window.snarkjs.groth16.verify(vkey, publicSignals, proof);
    setResult(`Verification result: ${res}`);
  };

  return (
    <VStack spacing={4} margin="20px" color="ethereum.800">
      <Text fontSize="2xl" color="ethereum.600">
        Snarkjs client example
      </Text>
      <Textarea
        placeholder="Enter input data as JSON"
        value={inputJson}
        onChange={(e) => setInputJson(e.target.value)}
      />
      <Box width="100%">
        <Editor
          height="400px"
          defaultLanguage="plaintext"
          defaultValue="// Loading..."
          value={circomCode}
          theme={colorMode === "dark" ? "vs-dark" : "light"}
          options={{
            readOnly: true,
            lineNumbers: "on",
            wordWrap: "on",
            automaticLayout: true,
          }}
        />
      </Box>
      <Button colorScheme="ethereum" onClick={calculateProof}>
        Create proof
      </Button>
      {/* Output boxes */}
      <Box width="100%" p={5} bg="ethereum.200">
        <Text>Proof:</Text>
        <Code
          width="100%"
          p={2}
          overflowX="auto"
          bg="ethereum.300"
          color="ethereum.800"
        >
          {proof}
        </Code>
      </Box>
      <Box width="100%" p={5} bg="ethereum.200">
        <Text>Result:</Text>
        <Code
          width="100%"
          p={2}
          overflowX="auto"
          bg="ethereum.300"
          color="ethereum.800"
        >
          {result}
        </Code>
      </Box>
      {/* Parse Error Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              JSON Parse Error
            </AlertDialogHeader>
            <AlertDialogBody>
              There was an error parsing your input. Please check your JSON
              syntax.
              <Box mt={4} color="red.500">
                {parseError}
              </Box>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default CircomEditorPage;
