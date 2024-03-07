import { configureStore } from "@reduxjs/toolkit";

import deploymentReducer from "./features/deployment/deploymentSlice";
import circomReducer from "./features/circom/circomSlice";
import contractDataReducer from "./features/circom/contractDataSlice";

export const store = configureStore({
  reducer: {
    circom: circomReducer,
    contractData: contractDataReducer,
    deployment: deploymentReducer,
  },
});
