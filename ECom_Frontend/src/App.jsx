import React, { useState } from "react";

// import Product from "./components/Product";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeProducts from "./components/UserFront/homeProducts";
import Cart from "./components/UserFront/Cart";

import { RegisterForm, SignInForm } from "./components/Auth/userSigninSignup";
import Auth from "./components/Auth/adminSignup";

// Protected token and Routes
import token from "./components/ProtectedRoutes";
import ProtectedRoute from "./components/ProtectedRoutes";

// Admin can handle this routes
import Dashboard from "./components/adminDashboard/mainDashboard";
import CreateProduct from "./components/adminDashboard/createProduct";

import OrdersList from "./components/adminDashboard/orderList";
import ProductList from "./components/adminDashboard/getAllProduct";

import MyDeliveryForm from "./components/UserFront/DeliveryDetail";
import OrderHistory from "./components/UserFront/OrderHistory";

// Admin get Products by Category
import ProductByCategory from "./components/adminDashboard/productByCategory";

// Admin Add Category
import AddCategory from "./components/adminDashboard/getCategory";
import GetCategory from "./components/adminDashboard/getCategory";

// User Support Message
import AddSupportMessage from "./components/adminDashboard/contactSupport";

//  Admin get total customers
import GetTotalUsers from "./components/adminDashboard/getAllCustomers";

// Admin get to know total incomes
import AdminIncomeManager from "./components/adminDashboard/adminIncome";

// Admin get to know total expenses
import AdminExpenseDashboard from "./components/adminDashboard/adminExpense";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  // const [data, setData] = useState([...items]);
  const [cart, setCart] = useState([]);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/userSignup" element={<RegisterForm />} />
          <Route path="/admin/signup" element={<Auth />} />
          {/* Public/Customer Routes */}
          <Route path="/signin" element={<SignInForm />} />
          <Route
            path="/"
            element={<HomeProducts cart={cart} setCart={setCart} />}
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/cart"
              element={<Cart cart={cart} setCart={setCart} />}
            />
            {/* Admin handle this routes */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/createProduct" element={<CreateProduct />} />
            <Route path="/getAllOrders" element={<OrdersList />} />
            <Route path="/productsList" element={<ProductList />} />
            <Route path="/deliveryorder" element={<MyDeliveryForm />} />
            <Route path="/orderhistory" element={<OrderHistory />} />
            {/* Admin Add Category Routes */}
            <Route path="/category" element={<AddCategory />} />
            <Route path="/getcategories" element={<GetCategory />} />
            <Route
              path="/productbycategory/:category"
              element={<ProductByCategory />}
            />
            {/* User support message */}
            <Route path="/support" element={<AddSupportMessage />} />

            {/* Admin get total customers */}
            <Route path="/users" element={<GetTotalUsers />} />
            {/* {user delete all products from carts} */}
            <Route path="/deleteAllFromCart/:userId" element={<Cart />} />

            {/* Admin get details of  Incomes */}
            <Route path="/income" element={<AdminIncomeManager />} />

            {/* Admin get details of  expenses */}
            <Route path="/expense" element={<AdminExpenseDashboard />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
