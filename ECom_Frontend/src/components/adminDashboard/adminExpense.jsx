import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav2 from "../sideNav/nav2";
import { FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { adminToken } from "../server";

const AdminExpenseDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [expenseDetails, setExpenseDetails] = useState({
    description: "",
    amount: "",
    category: "",
  });

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getExpenses", {
        headers: {
          Authorization: `${adminToken}`,
        },
      });
      console.log(response);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError("Failed to fetch expenses.");
    }
  };

  // Get expense by ID
  const fetchExpenseById = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/getExpense/${id}`,
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      );
      setSelectedExpense(response.data);
      setExpenseDetails({
        description: response.data.description,
        amount: response.data.amount,
        category: response.data.category,
        date: response.data.date.slice(0, 10),
      });
      setMessage("");
      setError("");
    } catch (error) {
      console.error("Error fetching expense by ID:", error);
      setError("Failed to fetch expense details.");
    }
  };

  // Add a new expense
  const addExpense = async () => {
    try {
      await axios.post("http://localhost:5000/addExpense", expenseDetails, {
        headers: {
          Authorization: `${adminToken}`,
        },
      });
      toast.success("Expense added successfully!");
      setError("");
      fetchExpenses();
      resetForm();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense.");
    }
  };

  // Update expense
  const updateExpense = async () => {
    try {
      await axios.put(
        `http://localhost:5000/updateExpense/${selectedExpense._id}`,
        expenseDetails,
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      );
      toast.success("Expense updated successfully!");
      setError("");
      fetchExpenses();
      resetForm();
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense.");
    }
  };

  // Delete expense with SweetAlert confirmation
  const deleteExpense = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/deleteExpense/${id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        toast.success("Expense deleted successfully!");
        setError("");
        fetchExpenses();
      } catch (error) {
        console.error("Error deleting expense:", error);
        toast.error("Failed to delete expense.");
      }
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setExpenseDetails({ ...expenseDetails, [e.target.name]: e.target.value });
  };

  // Reset form after adding/updating
  const resetForm = () => {
    setExpenseDetails({
      description: "",
      amount: "",
      category: "",
      date: "",
    });
    setSelectedExpense(null);
  };

  // Fetch all expenses
  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="flex w-full">
      <div className="flex w-[19%]">
        {/* Side Navigation */}
        <aside className=" bg-gray-800">
          <Nav2 />
        </aside>
      </div>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl shadow-lg bg-gray-200 font-serif font-semibold mb-6 text-center">
          Expense Dashboard :
        </h1>

        {message && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white font-serif shadow-md rounded px-8 pt-6 pb-8 mb-6">
          <h2 className="text-2xl font-semibold font-serif mb-4">
            {selectedExpense ? "Update Expense" : "Add Expense :"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              selectedExpense ? updateExpense() : addExpense();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Description:</label>
                <input
                  type="text"
                  name="description"
                  value={expenseDetails.description}
                  onChange={handleInputChange}
                  required
                  className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Amount:</label>
                <input
                  type="number"
                  name="amount"
                  value={expenseDetails.amount}
                  onChange={handleInputChange}
                  required
                  className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Category:</label>
                <input
                  type="text"
                  name="category"
                  value={expenseDetails.category}
                  onChange={handleInputChange}
                  required
                  className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                {selectedExpense ? "Update" : "Add"} Expense
              </button>
              {selectedExpense && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="ml-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="overflow-x-auto">
          <h2 className="text-2xl px-8 font-serif font-bold mb-4">
            Expenses List :
          </h2>
          <table className="min-w-full font-serif bg-white shadow-md rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id} className="text-center">
                  <td className="px-4 py-2 border">{expense.category}</td>
                  <td className="px-4 py-2 border">{expense.description}</td>
                  <td className="px-4 py-2 border">{expense.amount}</td>
                  <td className="px-4 py-2 border">
                    {expense.createdAt.slice(0, 10)}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => fetchExpenseById(expense._id)}
                      className="text-blue-500 text-2xl hover:underline"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteExpense(expense._id)}
                      className="text-red-500 text-2xl hover:underline ml-4"
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

      <ToastContainer />
    </div>
  );
};

export default AdminExpenseDashboard;
