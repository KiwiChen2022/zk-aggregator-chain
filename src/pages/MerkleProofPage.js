import React, { useState, useMemo } from "react";
import {
  Box,
  Flex,
  VStack,
  Text,
  Input,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import keccak256 from "keccak256";
import { useEthereum } from "../contexts/EthereumContext";
import { ethers } from "ethers";
import Dashboard from "../components/Dashbroad";
import { useSelector, useDispatch } from "react-redux";
import { setContractInteractionInfo } from "../features/contract/contractInteractionSlice";

const calculateEmptyHashes = () => {
  const emptyHashes = [keccak256("0").toString("hex")];
  for (let i = 1; i < 21; i++) {
    emptyHashes.push(keccak256(emptyHashes[i - 1]).toString("hex"));
  }
  return emptyHashes;
};

const calculateMerkleRootAndProof = (leafData, emptyHashes) => {
  let currentHash = keccak256(leafData).toString("hex");
  const proof = [];
  for (let i = 0; i < emptyHashes.length; i++) {
    proof.push(emptyHashes[i]);
    currentHash = keccak256(currentHash + emptyHashes[i]).toString("hex");
  }
  return { root: currentHash, proof };
};

const MerkleProofPage = () => {
  const [leafHash, setLeafHash] = useState("");
  const [merkleProof, setMerkleProof] = useState([]);
  const [merkleRoot, setMerkleRoot] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loadingLeaf, setLoadingLeaf] = useState(false);
  const [loadingProof, setLoadingProof] = useState(false);
  const [loadingVerification, setLoadingVerification] = useState(false);

  const { account, provider, signer, connect } = useEthereum();

  const emptyHashes = useMemo(() => calculateEmptyHashes(), []);
  const toast = useToast();

  const dispatch = useDispatch();

  const handleGetLeafHash = () => {
    setLoadingLeaf(true);
    setTimeout(() => {
      const hash = keccak256("zktxdata").toString("hex");
      setLeafHash(hash);
      setMerkleProof([]);
      setMerkleRoot("");
      setLoadingLeaf(false);
    }, 1000);
  };

  const handleGetMerkleProof = () => {
    if (!leafHash) {
      toast({
        title: "Please get the leaf hash first.",
        description: "Please get the leaf hash first.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    setLoadingProof(true);
    setTimeout(() => {
      const { root, proof } = calculateMerkleRootAndProof("data", emptyHashes);
      setMerkleProof(proof);
      setMerkleRoot(root);
      setLoadingProof(false);
    }, 3000);
  };

  const handleVerifyProof = async () => {
    if (!account || !provider || !signer) {
      toast({
        title: "MetaMask Connection Required.",
        description: "Please connect MetaMask first.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });

      return;
    }

    const contractAddress = process.env.REACT_APP_L1_ZKA_ADDRESS;
    const abiResponse = await fetch(
      `${process.env.PUBLIC_URL}/SPVVerifier.json`
    );
    const abi = await abiResponse.json();

    const contract = new ethers.Contract(contractAddress, abi.abi, signer);

    const leafHashBytes = ethers.getBytes(`0x${leafHash}`);
    const merkleProofBytes = merkleProof.map((p) => ethers.getBytes(`0x${p}`));

    console.log("I am here!");
    setLoadingVerification(true);
    try {
      const txResponse = await contract.verify(merkleProofBytes, leafHashBytes);
      console.log("I am here!!");
      await handleTransaction(txResponse, "Verify Merkle Proof");
      //   await contract.verify(merkleProofBytes, leafHashBytes);
      // alert("Verification success!");
      toast({
        title: "Verification Successful",
        description:
          "The zk merkle proof has been verified on L1 successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Verification failed:", error);
      // alert("Verification failed.");
      toast({
        title: "Verification Failed",
        description: `Error: ${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    setLoadingVerification(false);
  };

  async function handleTransaction(tx, operationName) {
    const txReceipt = await tx.wait();

    const gasUsed = txReceipt.gasUsed;
    const gasPrice = txReceipt.gasPrice;
    const totalGasCost = gasUsed * gasPrice;
    const network = await provider.getNetwork();
    const chainId = network.chainId.toString();
    const chainName = network.name ? network.name : `Chain ID: ${chainId}`; // in case no name
    const transactionHash = txReceipt.hash;

    console.log(tx);
    dispatch(
      setContractInteractionInfo({
        chainName: chainName,
        chainId: chainId,
        operationName: operationName,
        transactionHash: transactionHash,
        contractAddress: tx.to,
        gasUsed: gasUsed.toString(),
        gasPrice: ethers.formatUnits(gasPrice, "gwei"),
        totalCost: ethers.formatEther(totalGasCost),
      })
    );
  }

  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      margin="20px"
      wrap="wrap"
      align="flex-start"
    >
      <VStack flex={1} minW="0" spacing={4} color="ethereum.800" p={5}>
        <Text
          fontSize="2xl" // Slightly larger for emphasis
          fontWeight="bold" // Bold for prominence
          color="ethereum.900" // Ethereum blue for accent and consistency with your theme
          textAlign="center" // Center-align the title
          my={4} // Adds vertical margin for spacing
        >
          L1 ZK Verification
        </Text>

        <Text fontSize="lg" mt={4}>
          Enter L2 ZKP Transaction Hash:
        </Text>
        <Input
          placeholder="Enter L2 ZKP transaction hash"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
          mb={4}
        />

        <Button
          onClick={handleGetLeafHash}
          my={4}
          isLoading={loadingLeaf}
          spinner={<Spinner size="xs" />}
        >
          Get Leaf Hash
        </Button>
        {leafHash && <Text>Leaf Hash: {leafHash}</Text>}
        <Button
          onClick={handleGetMerkleProof}
          my={4}
          isLoading={loadingProof}
          spinner={<Spinner size="xs" />}
        >
          Get Merkle Proof
        </Button>
        {merkleRoot && <Text>Merkle Root: {merkleRoot}</Text>}
        {merkleProof.length > 0 && (
          <Box>
            <Text>Merkle Proof:</Text>
            {merkleProof.map((hash, index) => (
              <Text key={index}>{hash}</Text>
            ))}
          </Box>
        )}
        <Button
          onClick={handleVerifyProof}
          my={4}
          isLoading={loadingVerification}
          spinner={<Spinner size="xs" />}
        >
          Verify Merkle Proof on L1
        </Button>
      </VStack>
      <Box
        width={{ base: "100%", lg: "400px" }}
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

export default MerkleProofPage;
