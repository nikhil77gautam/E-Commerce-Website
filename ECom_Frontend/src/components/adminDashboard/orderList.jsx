import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Nav2 from "../sideNav/nav2";
import { FaEye } from "react-icons/fa";
import Modal from "../adminDashboard/EyeOrderListModeldetails";
import { getAllOrderList } from "../Redux/orderListSlice";
import { useDispatch, useSelector } from "react-redux";
import { token, adminToken } from "../server";

const OrdersList = () => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusOptions] = useState([
    "pending",
    "processing",
    "shipped",
    "delivered",
  ]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const allOrderList = useSelector(
    (state) => state.getAllOrderList.allOrderList
  );
  // const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(getAllOrderList());
  }, [dispatch]);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: ` ${adminToken}`,
          },
        }
      );
      // Refresh orders after update
      dispatch(getAllOrderList());
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  // Handle order status change with confirmation popup
  const handleStatusChange = (orderId, newStatus) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to update the order status to "${newStatus}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        updateOrderStatus(orderId, newStatus);
        Swal.fire("Updated!", "The order status has been updated.", "success");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "The order status was not changed.", "error");
      }
    });
  };

  // Filter orders based on the selected status
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(allOrderList);
    } else {
      const filtered = allOrderList?.filter(
        (order) => order.status === statusFilter
      );
      setFilteredOrders(filtered);
    }
  }, [statusFilter, allOrderList]);

  // Open the modal with the selected order
  const handleViewProducts = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="flex w-full">
      <div className="flex w-[15%]">
        {/* Side Navigation */}
        <aside className=" bg-gray-800">
          <Nav2 />
        </aside>
      </div>
      <main className="flex-1 p-6 md:p-8 bg-gray-100">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full">
          <h2 className="text-2xl bg-gray-200 font-serif shadow-lg font-semibold mb-6 text-center">
            Customers' All Orders
          </h2>

          {/* Status Filter Buttons */}
          <div className="flex font-serif justify-center mb-6 flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-md font-semibold ${
                statusFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              All
            </button>
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-md font-semibold ${
                  statusFilter === status
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto font-serif">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-700 font-serif text-white">
                <tr>
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Details</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders?.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="p-4 text-left">{order._id}</td>
                      <td className="p-4 text-left">{order.name}</td>
                      <td className="p-4 text-left">{order.email}</td>
                      <td className="p-4 text-left">{order.mobile}</td>
                      <td className="p-4 text-left">
                        <button
                          onClick={() => handleViewProducts(order)}
                          className="text-black hover:text-green-700 text-2xl flex items-center"
                        >
                          <FaEye />
                        </button>
                      </td>
                      <td className="p-4 text-left">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="p-2 border rounded-md text-gray-800 bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out w-full"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-left">
                        {/* Reset Button */}
                        {order.status !== "pending" && (
                          <button
                            onClick={() =>
                              handleStatusChange(order._id, "pending")
                            }
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-150 ease-in-out"
                          >
                            Reset
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-800">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          order={selectedOrder}
        />
      )}
    </div>
  );
};

export default OrdersList;
