import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {token }from "../../server";

const initialState = {
  shippedOrder: [],
  message: "",
  loading: false,
  error: null,
};

export const getShippedOrder = createAsyncThunk(
  "/orders/status/shipped",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/orders/status/shipped",
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

const getShippedOrderSlice = createSlice({
  name: "shippedOrder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getShippedOrder.pending, (state, action) => {
        state.loading = true;
      })

      .addCase(getShippedOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.shippedOrder = action.payload.orders;
        state.message = "success";
      })
      .addCase(getShippedOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getShippedOrderSlice.reducer;
