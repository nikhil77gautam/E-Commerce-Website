import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { getPendingOrder } from "../Redux/FetchOrderSlice/pendingSlice";
import { getProcessingOrder } from "../Redux/FetchOrderSlice/processingSlice";
import { getShippedOrder } from "../Redux/FetchOrderSlice/shippedSlice";
import { getDeliveredOrder } from "../Redux/FetchOrderSlice/deliveredSlice";
import { useDispatch, useSelector } from "react-redux";
import "flowbite";
import { getTotalCustomers } from "../Redux/getTotalCustomerSlice";
import { Link } from "react-router-dom";
import { adminToken } from "../server";
import pendingorder from "../../assets/pending.png";
import process from "../../assets/process.png";
import shipped from "../../assets/shipped.png";
import delivered from "../../assets/delivered.svg";
import Nav2 from "../sideNav/nav2";

ChartJS.register(ArcElement, Tooltip, Legend);

const ContentDashboard = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const dispatch = useDispatch();

  const getPendingOrders = useSelector(
    (state) => state.getPendingOrder.pendingOrder
  );
  const getProcessingOrders = useSelector(
    (state) => state.getProcessingOrder.processingOrder
  );
  const getShippedOrders = useSelector(
    (state) => state.getShippedOrder.shippedOrder
  );
  const getDeliveredOrders = useSelector(
    (state) => state.getDeliveredOrder.deliveredOrder
  );

  const totalCustomers = useSelector(
    (state) => state.getTotalCustomers.totalCustomers?.length
  );

  // Fetch Income
  const fetchIncome = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getIncomes", {
        headers: {
          Authorization: `${adminToken}`,
        },
      });
      const totalIncome = response.data.reduce(
        (acc, income) => acc + income.totalAmount,
        0
      );
      setIncome(totalIncome);
    } catch (error) {
      console.error("Error fetching income:", error);
    }
  };

  // Fetch Expenses
  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getExpenses", {
        headers: {
          Authorization: `${adminToken}`,
        },
      });
      const totalExpenses = response.data.reduce(
        (acc, expense) => acc + expense.amount,
        0
      );
      setExpenses(totalExpenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Fetch total active customers
  const fetchTotalUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/users", {
        headers: {
          Authorization: `${adminToken}`,
        },
      });
      setTotalUsers(response.data.length);
    } catch (error) {
      console.error("Error fetching total customers:", error);
    }
  };

  useEffect(() => {
    dispatch(getPendingOrder());
    dispatch(getProcessingOrder());
    dispatch(getShippedOrder());
    dispatch(getDeliveredOrder());
    fetchIncome();
    fetchExpenses();
    dispatch(getTotalCustomers());
    fetchTotalUsers();
  }, [dispatch]);

  // Data for Pie Chart
  const pieData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Income vs Expenses",
        data: [income, expenses],
        backgroundColor: ["#10b981", "#f87171"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="flex w-full">
      <div className="min-h-screen w-96 flex flex-col">
        <Nav2 />
      </div>

      {/* Main Content */}
      <main className=" p-8 w-full bg-gray-100 overflow-y-auto">
        <h2 className="text-2xl px-2 bg-gray-300 shadow-lg font-serif font-semibold mb-6 text-gray-800">
          Welcome You : Power at Your Fingertips.
        </h2>

        <div className="grid grid-cols-1 py-10 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pending Orders */}
          <div className="bg-white text-center py-9 border text-black w-full h-42 p-4 shadow-md rounded-lg">
            <h1 className="text-xl flex gap-5 font-semibold">
              <img src={pendingorder} alt="" className="size-8" />
              Pending Orders
            </h1>
            <p className="text-3xl text-red-600 p-4 font-bold">
              {getPendingOrders?.orders?.length
                ? getPendingOrders.orders.length
                : 0}
            </p>
            <Link
              to="/getallorders"
              className="py-2 rounded-lg hover:bg-blue-400 bg-blue-500 px-4"
            >
              View All..
            </Link>
          </div>

          {/* Processing Orders */}
          <div className="bg-white text-center text-black border w-full h-42 py-9 p-4 shadow-md rounded-lg">
            <h1 className="text-xl flex gap-5 font-semibold">
              <img src={process} alt="" className="size-8" />
              Processing Orders
            </h1>
            <p className="text-3xl text-yellow-600 p-4 font-bold">
              {getProcessingOrders?.length ? getProcessingOrders.length : 0}
            </p>
            <Link
              to="/getallorders"
              className="py-2 rounded-lg hover:bg-blue-400 bg-blue-500 px-4"
            >
              View All..
            </Link>
          </div>

          {/* Shipped Orders */}
          <div className="bg-white text-center text-black w-full h-42 border py-9 p-4 shadow-md rounded-lg">
            <h1 className="text-xl flex gap-5 font-semibold">
              <img src={shipped} alt="" className="size-8 text-black" />
              Shipped Orders
            </h1>
            <p className="text-3xl text-orange-600 p-4 font-bold">
              {getShippedOrders?.length ? getShippedOrders.length : 0}
            </p>
            <Link
              to="/getallorders"
              className="py-2 rounded-lg hover:bg-blue-400 bg-blue-500 px-4"
            >
              View All..
            </Link>
          </div>

          {/* Delivered Orders */}
          <div className="bg-white text-center text-black w-full h-42 py-9 border p-4 shadow-md rounded-lg">
            <h1 className="text-xl flex gap-5 font-semibold">
              <img src={delivered} alt="" className="size-8" />
              Delivered Orders
            </h1>
            <p className="text-3xl text-green-600 p-4 font-bold">
              {getDeliveredOrders?.length ? getDeliveredOrders.length : 0}
            </p>
            <Link
              to="/getallorders"
              className="py-2 rounded-lg hover:bg-blue-400 bg-blue-500 px-4"
            >
              View All..
            </Link>
          </div>
        </div>

        {/* Pie chart section */}
        <div className="flex justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Income vs Expenses :
            </h3>
            <div className="flex justify-center items-center p-8">
              <div className="relative border bg-white shadow-lg w-96 rounded-xl h-96">
                <Pie data={pieData} />
              </div>
            </div>
          </div>

          {/* Total Active Customers Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              All Created Customers :
            </h3>
            <div className="flex justify-center items-center p-8">
              <div className="relative border bg-white shadow-lg w-96 rounded-xl h-96 flex flex-col justify-center items-center">
                <p className="text-5xl font-bold text-green-600">
                  {totalCustomers}
                </p>
                <p className="text-lg text-gray-600 mt-4">
                  Total Active Customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentDashboard;
