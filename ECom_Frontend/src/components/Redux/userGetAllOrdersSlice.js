import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { token, userId, adminToken } from "../server";

const initialState = {
  userAllOrder: [],
  message: "",
  loading: false,
  error: null,
};

export const getuserAllOrder = createAsyncThunk(
  "/userAllOrders/:userId",
  async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/userAllOrders/${userId}`,
        {
          headers: { Authorization: token || adminToken },
        }
      );
      // console.log(response);

      return response.data;
    } catch (error) {
      return { Error: error.message };  
    }
  }
);

const getuserAllOrderSlice = createSlice({
  name: "userAllOrder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getuserAllOrder.pending, (state, action) => {
        state.loading = true;
      })

      .addCase(getuserAllOrder.fulfilled, (state, action) => {
        state.loading = false;
        //  console.log(action.payload.orders)
        state.userAllOrder = action.payload.orders;
        state.message = "success";
      })
      .addCase(getuserAllOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getuserAllOrderSlice.reducer;
