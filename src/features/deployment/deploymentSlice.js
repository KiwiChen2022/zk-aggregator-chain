import { createSlice } from "@reduxjs/toolkit";

export const deploymentSlice = createSlice({
  name: "deployment",
  initialState: {
    chainName: "",
    chainId: 0,
    transactionHash: "",
    contractAddress: "",
    gasUsed: "",
    gasPrice: "",
    totalCost: "",
  },
  reducers: {
    setDeploymentInfo: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setDeploymentInfo } = deploymentSlice.actions;

export default deploymentSlice.reducer;
