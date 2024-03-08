import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const calculateProofAsync = createAsyncThunk(
  "circom/calculateProof",
  async (inputData, thunkAPI) => {
    const circuitWasmPath = `${process.env.PUBLIC_URL}/circuit.wasm`;
    const circuitZkeyPath = `${process.env.PUBLIC_URL}/circuit_final.zkey`;
    const verificationKeyPath = `${process.env.PUBLIC_URL}/verification_key.json`;

    try {
      const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
        inputData,
        circuitWasmPath,
        circuitZkeyPath
      );

      const vkey = await fetch(verificationKeyPath).then((res) => res.json());

      const verificationResult = await window.snarkjs.groth16.verify(
        vkey,
        publicSignals,
        proof
      );

      return {
        proof: JSON.stringify(proof, null, 2),
        publicSignals: JSON.stringify(publicSignals, null, 2),
        verificationResult,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const circomSlice = createSlice({
  name: "circom",
  initialState: {
    proof: "",
    publicSignals: "",
    verificationResult: false,
    status: "idle", // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {
    resetCircomState: (state) => {
      state.proof = "";
      state.publicSignals = "";
      state.verificationResult = false;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateProofAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(calculateProofAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.proof = action.payload.proof;
        state.publicSignals = action.payload.publicSignals;
        state.verificationResult = action.payload.verificationResult;
      })
      .addCase(calculateProofAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetCircomState } = circomSlice.actions;

export default circomSlice.reducer;
