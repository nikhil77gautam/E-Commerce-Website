import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Nav2 from "../../components/sideNav/nav2";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { getAllCategories } from "../Redux/getAllCategoriesSlice";
import { useDispatch, useSelector } from "react-redux";
import { adminToken, token } from "../server";

const GetCategory = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const allCategories = useSelector(
    (state) => state.getAllCategories.allCategories
  );
  console.log(allCategories);

  // const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Get categories with their counts
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // Update category
  const handleUpdateCategory = async (categoryId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/category/${categoryId}`,
        { name: newCategoryName },
        {
          headers: {
            Authorization: `${adminToken || token}`,
          },
        }
      );
      setCategories((prev) =>
        prev.map((category) =>
          category._id === categoryId
            ? { ...category, name: response.data.name }
            : category
        )
      );
      Swal.fire("Success", "Category updated successfully!", "success");
      setEditingCategoryId(null);
      setNewCategoryName("");
    } catch (err) {
      Swal.fire("Error", "Failed to update category.", "error");
    }
  };

  // Delete category with SweetAlert confirmation
  const handleDeleteCategory = async (categoryId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/category/${categoryId}`, {
            headers: {
              Authorization: `${adminToken || token}`,
            },
          });
          setCategories((prev) =>
            prev.filter((category) => category._id !== categoryId)
          );
          Swal.fire("Deleted!", "Category has been deleted.", "success");
        } catch (err) {
          Swal.fire("Error", "Failed to delete category.", "error");
        }
      }
    });
  };

  // Add category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/category",
        { name: categoryName },
        {
          headers: {
            Authorization: `${adminToken || token}`,
          },
        }
      );
      setCategoryName("");
      setIsModalOpen(false);
      Swal.fire("Success", "Category added successfully!", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to add category.", "error");
    }
  };

  // Navigate to ProductByCategory
  const handleViewProducts = (category) => {
    navigate(`/ProductByCategory/${category}`);
  };

  return (
    <div className="flex w-full">
      <div className="flex w-[13%]">
        {/* Side Navigation */}
        <aside className=" bg-gray-800">
          <Nav2 />
        </aside>
      </div>
      <div className="flex-grow min-h-screen font-serif bg-white p-6 md:p-8 lg:p-12 shadow-md rounded-lg mx-4 md:mx-8 lg:mx-12 mt-4 md:mt-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl shadow-lg font-semibold">
            Categories:
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-4 text-white rounded flex gap-2 "
          >
            <svg
              class="w-12 h-12 bg-gray-800 shadow-lg hover:bg-gray-200 rounded-lg hover:text-green-700"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Categories Table */}
        {allCategories && allCategories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-left">No of Products</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {allCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {editingCategoryId === category._id ? (
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded"
                          placeholder="Enter new category name"
                        />
                      ) : (
                        <span className="font-medium">{category.name}</span>
                      )}
                    </td>
                    <td className="py-3 px-20 text-left">
                      {category.categoryCount}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {editingCategoryId === category._id ? (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleUpdateCategory(category._id)}
                            className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCategoryId(null)}
                            className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-500"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewProducts(category.name)}
                            className="text-black hover:text-green-700 text-2xl flex items-center"
                          >
                            <FaEye className="mr-2" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingCategoryId(category._id);
                              setNewCategoryName(category.name);
                            }}
                            className="text-blue-500 hover:text-yellow-600 text-2xl"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="text-red-600 hover:text-red-700 text-2xl"
                          >
                            <MdDeleteSweep />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No categories found.</p>
        )}
      </div>

      {/* Modal for adding category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 font-serif overflow-y-auto">
          <div className="fixed inset-0 w-full h-full bg-black opacity-40" />
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="relative w-full max-w-lg p-6 mx-auto bg-white rounded-lg shadow-lg">
              <h2 className="text-lg  font-semibold mb-4">Add Category :</h2>
              <form onSubmit={handleAddCategory}>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
                  placeholder="Enter category name"
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                    className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetCategory;
