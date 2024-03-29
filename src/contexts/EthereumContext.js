import React, { createContext, useContext, useState } from "react";
import { ethers } from "ethers";

const EthereumContext = createContext();

export const useEthereum = () => useContext(EthereumContext);

const checkNetwork = async (provider) => {
  const expectedChainId = 31337;
  const network = await provider.getNetwork();
  if (network.chainId !== expectedChainId) {
    return false;
  }
  return true;
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
      // const provider = new JsonRpcProvider(window.ethereum);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      const networkOk = await checkNetwork(provider);
      if (!networkOk) {
        setError("You're connected to an unsupported network.");
        return;
      }

      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const account = await signer.getAddress();

      // const accounts = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });
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
