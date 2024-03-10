import { createSlice } from "@reduxjs/toolkit";

export const contractInteractionSlice = createSlice({
  name: "contractInteraction",
  initialState: {
    chainName: "",
    chainId: 0,
    operationName: "",
    transactionHash: "",
    contractAddress: "",
    gasUsed: "",
    gasPrice: "",
    totalCost: "",
  },
  reducers: {
    setContractInteractionInfo: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setContractInteractionInfo } = contractInteractionSlice.actions;

export default contractInteractionSlice.reducer;
