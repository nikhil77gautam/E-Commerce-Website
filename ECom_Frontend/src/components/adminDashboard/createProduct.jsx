import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GrUserAdmin } from "react-icons/gr";
import Nav2 from "../../components/sideNav/nav2";
import { adminToken } from "../server";
const CreateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("null");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState("");

  const navigate = useNavigate();

  // Fetch the token from localStorage or other secure storage
  // const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCategories();
  }, [category]);

  // Get Category
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categories", {
        headers: {
          Authorization: `${adminToken}`,
        },
      });
      console.log(response);
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProduct = { name, price, description, stock, image, category };
      console.log(newProduct);
      await axios.post("http://localhost:5000/createProduct", newProduct, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Navigate after successful submit
      navigate("/productsList");

      alert("Product Added Successfully!");

      setName("");
      setPrice("");
      setDescription("");
      setImage("");
      setCategory("");
    } catch (error) {
      console.error("Error creating product", error);
    }
  };

  return (
    <div className="flex min-h-screen font-serif bg-gray-300">
      <Nav2 />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold shadow-lg text-center mb-6">
            Create Product
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="p-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Product Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Product Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2">
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Price
                    </label>
                    <input
                      id="price"
                      type="text"
                      placeholder="Price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2">
                    <label
                      htmlFor="stock"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Stock
                    </label>
                    <input
                      id="stock"
                      type="text"
                      placeholder="Stock"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category
                    </label>
                    <select
                      id="categoryFilter"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="All">All Categories</option>
                      {categories.length > 0 &&
                        categories.map((category) => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="p-2">
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Image
                    </label>
                    <input
                      id="image"
                      type="file"
                      onChange={(e) => setImage(e.target.files[0])}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-gray-200"
                      rows="3"
                    ></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Add Product
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateProduct;
