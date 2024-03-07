import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchContractData = createAsyncThunk(
  "contractData/fetchContractData",
  async (_, { rejectWithValue }) => {
    try {
      const url = `${process.env.PUBLIC_URL}/Groth16Verifier.json`;
      const response = await fetch(url);
      const data = await response.json();
      return { abi: data.abi, bytecode: data.bytecode };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const contractDataSlice = createSlice({
  name: "contractData",
  initialState: {
    abi: [],
    bytecode: "",
    status: "idle", // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {
    // Optional: Reducers for other synchronous updates
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContractData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchContractData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.abi = action.payload.abi;
        state.bytecode = action.payload.bytecode;
      })
      .addCase(fetchContractData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default contractDataSlice.reducer;
