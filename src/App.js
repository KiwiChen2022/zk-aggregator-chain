import React, { useEffect } from "react";
import { ChakraProvider, useToast } from "@chakra-ui/react";
import { EthereumProvider, useEthereum } from "./contexts/EthereumContext";
import AppRoutes from "./routes/AppRoutes";
import theme from "./theme";
import { useDispatch } from "react-redux";
import { fetchContractData } from "./features/circom/contractDataSlice";

const AppWithToast = () => {
  const { error } = useEthereum();
  const toast = useToast();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchContractData());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  return <AppRoutes />;
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <EthereumProvider>
        <AppWithToast />
      </EthereumProvider>
    </ChakraProvider>
  );
}

export default App;
