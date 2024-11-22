import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { adminToken, adminId } from "../server";

const initialState = {
  totalCustomers: [],
  message: "",
  loading: false,
  error: null,
};

export const getTotalCustomers = createAsyncThunk("/admin/users", async () => {
  try {
    const response = await axios.get(`http://localhost:5000/admin/users`, {
      headers: { Authorization: adminToken },
    });
    console.log(response);

    return response.data;
  } catch (error) {
    return { Error: error.message };
  }
});

const getTotalCustomerSlice = createSlice({
  name: "totalCustomers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTotalCustomers.pending, (state, action) => {
        state.loading = true;
      })

      .addCase(getTotalCustomers.fulfilled, (state, action) => {
        state.loading = false;
        //  console.log(action.payload.users)
        state.totalCustomers = action.payload.users;
        state.message = "success";
      })
      .addCase(getTotalCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default getTotalCustomerSlice.reducer;
