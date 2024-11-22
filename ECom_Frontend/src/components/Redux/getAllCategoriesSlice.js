import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { token, adminToken } from "../server";

const initialState = {
  allCategories: [],
  message: "",
  loading: false,
  error: null,
};

export const getAllCategories = createAsyncThunk("/categories", async () => {
  try {
    const response = await axios.get("http://localhost:5000/categories", {
      headers: {
        Authorization: token || adminToken,
      },
    });
    console.log(response);

    console.log(response);
    return response.data;
  } catch (error) {
    return { Error: error.message };
  }
});

const getAllCategoriesSlice = createSlice({
  name: "allCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state, action) => {
        state.loading = true;
      })

      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.allCategories = action.payload;
        state.message = "success";
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getAllCategoriesSlice.reducer;
