import { configureStore } from "@reduxjs/toolkit";
import getProductListSlice from "./getProductSlice";
import getPendingOrderSlice from "./FetchOrderSlice/pendingSlice";
import getProcessingOrderSlice from "./FetchOrderSlice/processingSlice";
import getShippedOrderSlice from "./FetchOrderSlice/shippedSlice";
import getDeliveredrderSlice from "./FetchOrderSlice/deliveredSlice";
import getuserAllOrderSlice from "../Redux/userGetAllOrdersSlice";
import getTotalCustomerSlice from "./getTotalCustomerSlice";
import getAllCategoriesSlice from "./getAllCategoriesSlice";
import getAllOrderListSlice from "./orderListSlice";

export const store = configureStore({
  reducer: {
    getProductList: getProductListSlice,
    getPendingOrder: getPendingOrderSlice,
    getProcessingOrder: getProcessingOrderSlice,
    getShippedOrder: getShippedOrderSlice,
    getDeliveredOrder: getDeliveredrderSlice,
    getUserAllOrder: getuserAllOrderSlice,
    getTotalCustomers: getTotalCustomerSlice,
    getAllCategories: getAllCategoriesSlice,
    getAllOrderList: getAllOrderListSlice,
  },
});
