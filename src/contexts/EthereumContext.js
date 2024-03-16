import React, { createContext, useContext, useState } from "react";
import { ethers } from "ethers";

const EthereumContext = createContext();

export const useEthereum = () => useContext(EthereumContext);

const checkNetwork = async (provider) => {
  return true;
  // const expectedChainId = process.env.REACT_APP_L2_CHAINID;
  // try {
  //   const network = await provider.getNetwork();
  //   if (network.chainId.toString() !== expectedChainId) {
  //     console.log(
  //       `Connected to chainId ${network.chainId}, but expected ${expectedChainId}`
  //     );
  //     return false;
  //   }
  //   return true;
  // } catch (error) {
  //   console.error("Error checking network chainId:", error);
  //   return false;
  // }
};

export const EthereumProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState("");
  const [signer, setSigner] = useState(null);

  const connect = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install MetaMask.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      const networkOk = await checkNetwork(provider);
      if (!networkOk) {
        setError("You're connected to an unsupported network.");
        return;
      }

      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const account = signer.address;

      setAccount(account);
      setSigner(signer);
      setError("");
    } catch (error) {
      console.error("Failed to connect MetaMask", error);
      setError("Failed to connect MetaMask.");
    }
  };

  return (
    <EthereumContext.Provider
      value={{ account, provider, signer, connect, error }}
    >
      {children}
    </EthereumContext.Provider>
  );
};
