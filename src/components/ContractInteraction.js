import React, { useEffect, useState } from "react";
import { useEthereum } from "../contexts/EthereumContext";
import { useSelector } from "react-redux";
import { ethers } from "ethers";

const ContractInteraction = () => {
  const { signer } = useEthereum();
  const { contractAddress } = useSelector((state) => state.deployment);
  const { proof, publicSignals } = useSelector((state) => state.circom);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState("");

  const abi = [
    /* ABI array from Groth16Verifier.json */
  ];
  const bytecode = "bytecode from Groth16Verifier.json";

  useEffect(() => {
    if (!contractAddress || !proof || !publicSignals.length || !signer) {
      setError("Missing data for contract interaction");
      return;
    }

    const contract = new ethers.Contract(contractAddress, abi, signer);

    const verifyProof = async () => {
      try {
        const parsedProof = JSON.parse(proof);
        const _pA = parsedProof.pi_a;
        const _pB = parsedProof.pi_b;
        const _pC = parsedProof.pi_c;
        const _pubSignals = publicSignals;

        const result = await contract.verifyProof(_pA, _pB, _pC, _pubSignals);
        setVerificationResult(result);
      } catch (err) {
        setError("Contract interaction failed: " + err.message);
      }
    };

    verifyProof();
  }, [contractAddress, proof, publicSignals, signer]);

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <p>
          Verification Result:{" "}
          {verificationResult !== null
            ? verificationResult.toString()
            : "Loading..."}
        </p>
      )}
    </div>
  );
};

export default ContractInteraction;
