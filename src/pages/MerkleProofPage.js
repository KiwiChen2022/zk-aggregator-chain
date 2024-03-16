import React, { useState, useMemo } from "react";
import { Box, Button, Text, Spinner, Input } from "@chakra-ui/react";
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

// const handleVerifyProof = async (account, provider, signer) => {
//   if (!account || !provider || !signer) {
//     alert("Please connect MetaMask first.");
//     return;
//   }

//   const contractAddress = process.env.REACT_APP_L1_ZKA_ADDRESS;
//   const abiResponse = await fetch(`${process.env.PUBLIC_URL}/SPVVerifier.json`);
//   const abi = await abiResponse.json();

//   const contract = new ethers.Contract(contractAddress, abi.abi, signer);

//   const leafHashBytes = ethers.utils.arrayify(leafHash);
//   const merkleProofBytes = merkleProof.map(ethers.utils.arrayify);

//   try {
//     await contract.verify(merkleProof, leafHash, "0x0");
//     alert("Verification success!");
//   } catch (error) {
//     console.error("Verification failed:", error);
//     alert("Verification failed.");
//   }
// };

const MerkleProofPage = () => {
  const [leafHash, setLeafHash] = useState("");
  const [merkleProof, setMerkleProof] = useState([]);
  const [merkleRoot, setMerkleRoot] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loadingLeaf, setLoadingLeaf] = useState(false);
  const [loadingProof, setLoadingProof] = useState(false);
  const { account, provider, signer, connect } = useEthereum();

  const emptyHashes = useMemo(() => calculateEmptyHashes(), []);
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
      alert("Please get the leaf hash first.");
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
      alert("Please connect MetaMask first.");
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
    try {
      const txResponse = await contract.verify(merkleProofBytes, leafHashBytes);
      console.log("I am here!!");
      await handleTransaction(txResponse, "Verify Merkle Proof");
      //   await contract.verify(merkleProofBytes, leafHashBytes);
      alert("Verification success!");
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Verification failed.");
    }
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
    <Box p={5}>
      <Text fontSize="xl">L1 ZK VERIFICATION</Text>
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
        // isLoading={loadingVerification}
      >
        Verify Merkle Proof on L1
      </Button>
      <Dashboard />
    </Box>
  );
};

export default MerkleProofPage;
