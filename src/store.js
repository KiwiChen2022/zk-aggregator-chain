import { configureStore } from "@reduxjs/toolkit";

import contractInteractionReducer from "./features/contract/contractInteractionSlice";
import circomReducer from "./features/circom/circomSlice";
import contractDataReducer from "./features/circom/contractDataSlice";

export const store = configureStore({
  reducer: {
    circom: circomReducer,
    contractData: contractDataReducer,
    contractInteraction: contractInteractionReducer,
  },
});
