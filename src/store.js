import { configureStore } from "@reduxjs/toolkit";

import deploymentReducer from "./features/deployment/deploymentSlice";
import circomReducer from "./features/circom/circomSlice";

export const store = configureStore({
  reducer: {
    circom: circomReducer,
    deployment: deploymentReducer,
  },
});
