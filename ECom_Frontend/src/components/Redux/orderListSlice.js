import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { token, adminToken } from "../server";

const initialState = {
  allOrderList: [],
  message: "",
  loading: false,
  error: null,
};

export const getAllOrderList = createAsyncThunk(
  "/adminGetAllOrders",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/adminGetAllOrders",
        {
          headers: { Authorization: `${token || adminToken}` },
        }
      );

      return response.data;
    } catch (error) {
      return { Error: error.message };
    }
  }
);

const getAllOrderListSlice = createSlice({
  name: "allOrderList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrderList.pending, (state, action) => {
        state.loading = true;
      })

      .addCase(getAllOrderList.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload)
        state.allOrderList = action.payload.orders;
        state.message = "success";
      })
      .addCase(getAllOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getAllOrderListSlice.reducer;
