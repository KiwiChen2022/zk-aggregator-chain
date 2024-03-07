import React, { createContext, useContext, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";

const EthereumContext = createContext();

export const useEthereum = () => useContext(EthereumContext);

const checkNetwork = async (provider) => {
  const expectedChainId = 1001;
  const network = await provider.getNetwork();
  if (network.chainId !== expectedChainId) {
    return false;
  }
  return true;
};

export const EthereumProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");

  const connect = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install MetaMask.");
      return;
    }

    try {
      const provider = new Web3Provider(window.ethereum);
      const networkOk = await checkNetwork(provider);
      if (!networkOk) {
        setError("You're connected to an unsupported network.");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setError("");
    } catch (error) {
      console.error("Failed to connect MetaMask", error);
      setError("Failed to connect MetaMask.");
    }
  };

  return (
    <EthereumContext.Provider value={{ account, connect, error }}>
      {children}
    </EthereumContext.Provider>
  );
};
