import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav2 from "../sideNav/nav2";
// import { FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import "sweetalert2/dist/sweetalert2.min.css";
import { adminToken } from "../server";

const AdminIncomeManager = () => {
  const [incomes, setIncomes] = useState([]);
  const [amount, setAmount] = useState("");
  const [editingId, setEditingId] = useState(null);

  // const token = localStorage.getItem("token");

  useEffect(() => {
    fetchIncomes();
  }, []);

  // Get Income
  const fetchIncomes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getIncomes", {
        headers: {
          Authorization: `${adminToken}`,
        },
      });
      setIncomes(response.data);
    } catch (error) {
      toast.error("Error fetching incomes");
    }
  };

  // Update Income
  const handleUpdateIncome = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/incomes/${editingId}`,
        { amount: amount },
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      );
      setIncomes(
        incomes.map((income) =>
          income._id === editingId ? response.data : income
        )
      );
      setAmount("");
      setEditingId(null);
      toast.success("Income updated successfully");
    } catch (error) {
      toast.error("Error updating income");
    }
  };

  // Delete Income
  const handleDeleteIncome = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/incomes/${id}`, {
        headers: {
          Authorization: `${adminToken}`,
        },
      });
      setIncomes(incomes.filter((income) => income._id !== id));
      toast.success("Income deleted successfully");
    } catch (error) {
      toast.error("Error deleting income");
    }
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteIncome(id);
        Swal.fire("Deleted!", "Income has been deleted.", "success");
      }
    });
  };

  return (
    <div className="flex w-full">
      <div className="flex w-[19%]">
        {/* Side Navigation */}
        <aside className=" bg-gray-800">
          <Nav2 />
        </aside>
      </div>
      <div className="container mx-auto p-4">
        <ToastContainer />
        <h1 className="text-3xl bg-gray-200 shadow-lg font-serif font-semibold mb-6 text-center mt-4">
          Income Dashboard :
        </h1>

        <table className="min-w-full font-serif bg-white border text-center border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">User Name</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income) => (
              <tr key={income._id}>
                <td className="border p-2">
                  {income.userId && income.userId.name}
                </td>{" "}
                {/* Display user name */}
                <td className="border p-2">
                  {new Date(income.date).toLocaleDateString()}
                </td>
                <td className="border p-2">{income.totalAmount}</td>
                <td className="border p-2">
                  {/* <button
                    onClick={() => {
                      setAmount(income.amount);
                      setEditingId(income._id);
                    }}
                    className="text-blue-600 text-2xl p-1"
                  >
                    <FaEdit />
                  </button> */}
                  <button
                    onClick={() => confirmDelete(income._id)}
                    className="text-red-600 text-2xl p-1"
                  >
                    <MdDeleteSweep />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminIncomeManager;
