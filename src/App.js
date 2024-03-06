import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import AppRoutes from "./routes/AppRoutes";
import theme from "./theme";

import { Buffer } from "buffer";
window.Buffer = Buffer; // Make Buffer available globally
function App() {
  return (
    <ChakraProvider theme={theme}>
      <AppRoutes />
    </ChakraProvider>
  );
}

export default App;
