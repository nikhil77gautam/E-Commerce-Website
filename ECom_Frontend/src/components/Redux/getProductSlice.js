import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { token, adminToken } from "../server";

const initialState = {
  admin: [],
  message: "",
  loading: false,
  error: null,
};

export const getProductList = createAsyncThunk("/productsList", async () => {
  try {
    const response = await axios.get("http://localhost:5000/getAllProducts", {
      headers: { Authorization: token || adminToken },
    });

    return response.data;
  } catch (error) {
    return { Error: error.message };
  }
});

const getProductListSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductList.pending, (state, action) => {
        state.loading = true;
      })

      .addCase(getProductList.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(action.payload.products)
        state.admin = action.payload.products;
        state.message = "success";
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getProductListSlice.reducer;
