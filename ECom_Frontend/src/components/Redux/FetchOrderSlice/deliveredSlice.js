import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {token} from "../../server";

const initialState = {
  deliveredOrder: [],
  message: "",
  loading: false,
  error: null,
};

export const getDeliveredOrder = createAsyncThunk(
  "/orders/status/delivered",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/orders/status/delivered",
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

const getDeliveredOrderSlice = createSlice({
  name: "deliveredOrder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDeliveredOrder.pending, (state, action) => {
        state.loading = true;
      })

      .addCase(getDeliveredOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveredOrder = action.payload.orders;
        state.message = "success";
      })
      .addCase(getDeliveredOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getDeliveredOrderSlice.reducer;
