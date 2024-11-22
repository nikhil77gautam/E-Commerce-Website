import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {token}from "../../server";

const initialState = {
  processingOrder: [],
  message: "",
  loading: false,
  error: null,
};

export const getProcessingOrder = createAsyncThunk(
  "/orders/status/processing",
  async () => {
    try {
        
      const response = await axios.get(
        "http://localhost:5000/orders/status/processing",
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

const getProcessingOrderSlice = createSlice({
  name: "processingOrder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProcessingOrder.pending, (state, action) => {
        state.loading = true;
      })

      .addCase(getProcessingOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.processingOrder = action.payload.orders
        ;
        state.message = "success";
      })
      .addCase(getProcessingOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getProcessingOrderSlice.reducer;
