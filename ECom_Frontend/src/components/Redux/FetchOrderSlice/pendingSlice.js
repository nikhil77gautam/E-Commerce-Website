import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {token} from "../../server";

const initialState = {
  pendingOrder: [],
  message: "",
  loading: false,
  error: null,
};

export const getPendingOrder = createAsyncThunk(
  "/orders/status/pending",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/orders/status/pending",
        {
          headers: { Authorization: token },
        }
      );
      return response.data;
    } catch (error) {
      return { Error: error.message };
    }
  }
);

const getPendingOrderSlice = createSlice({
  name: "pendingOrder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPendingOrder.pending, (state, action) => {
        state.loading = true;
      })

      .addCase(getPendingOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingOrder = action.payload;
        state.message = "success";
      })
      .addCase(getPendingOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getPendingOrderSlice.reducer;
