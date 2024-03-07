import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculateProofAsync } from "../features/circom/circomSlice";
import {
  Button,
  Text,
  Box,
  VStack,
  Code,
  useColorMode,
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

const CircomEditor = () => {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const [inputJson, setInputJson] = useState('{ "a": 3, "b": 11 }');
  const [circomCode, setCircomCode] = useState("");
  const [parseError, setParseError] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const { proof, publicSignals, verificationResult, status, error } =
    useSelector((state) => state.circom);

  // Fetch pre-compiled circom file
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/circuit.circom`)
      .then((res) => res.text())
      .then((text) => setCircomCode(text))
      .catch((err) => console.error("Failed to load circuit.circom", err));
  }, []);

  // Simplified calculateProof function
  const calculateProof = () => {
    let inputData;
    try {
      inputData = JSON.parse(inputJson);
      // Dispatch Redux action
      dispatch(calculateProofAsync(inputData));
    } catch (error) {
      setParseError(error.toString());
      onOpen();
    }
  };

  return (
    <VStack spacing={4} width="full" margin="20px" color="ethereum.800">
      <Text fontSize="2xl" color="ethereum.600">
        Circom example
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
      <Button
        colorScheme="ethereum"
        onClick={calculateProof}
        isLoading={status === "loading"}
      >
        Create proof
      </Button>
      {/* Output boxes for proof and result */}
      {status === "succeeded" && (
        <>
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
              Verification result: {verificationResult.toString()}
            </Code>
          </Box>
        </>
      )}
      {status === "failed" && <Text color="red.500">{error}</Text>}

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

export default CircomEditor;
