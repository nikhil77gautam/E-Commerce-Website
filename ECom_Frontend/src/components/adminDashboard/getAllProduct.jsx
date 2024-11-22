import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaTimes } from "react-icons/fa";
import Nav2 from "../sideNav/nav2";
import { getProductList } from "../Redux/getProductSlice";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { MdDeleteSweep } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { token, adminToken } from "../server";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    category: "Electronics",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewProduct, setViewProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const admin = useSelector((state) => state.getProductList.admin);

  // const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(getProductList());
  }, [dispatch]);

  const deleteProduct = async (productId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/deleteProduct/${productId}`, {
          headers: {
            Authorization: `${token || adminToken}`,
          },
        });
        dispatch(getProductList());
        Swal.fire("Deleted!", "The product has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting product", error);
      Swal.fire("Error!", "There was an error deleting the product.", "error");
    }
  };

  const handleViewClick = (product) => {
    setViewProduct(product);
    setIsViewModalOpen(true);
  };

  const handleUpdateClick = (product) => {
    setEditingProduct(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock || "",
      description: product.description || "",
      image: null,
      category: product.category || "Electronics",
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("price", formData.price);
      form.append("stock", formData.stock);
      form.append("description", formData.description);
      form.append("category", formData.category);
      if (formData.image) {
        form.append("image", formData.image);
      }

      await axios.put(
        `http://localhost:5000/updateProduct/${editingProduct}`,
        form,
        {
          headers: {
            Authorization: `${token || adminToken}`,
          },
        }
      );
      window.alert("Producted Updated Successfully");
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({
        name: "",
        price: "",
        stock: "",
        description: "",
        image: "",
        category: "",
      });
      // fetchProducts();
    } catch (error) {
      console.error("Error updating product", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts = admin.filter((product) =>
    selectedCategory === "All" ? true : product.category === selectedCategory
  );

  return (
    <div className="flex w-full">
      <div className="flex w-[18%]">
        {/* Side Navigation */}
        <aside className=" bg-gray-800">
          <Nav2 />
        </aside>
      </div>
      <div className="flex min-h-screen bg-gray-200 font-serif">
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-auto">
          <h2 className="text-2xl shadow-lg font-bold mb-6 text-center">
            All Products' :
          </h2>

          <div className="mb-4">
            <label
              htmlFor="categoryFilter"
              className="block text-sm font-medium text-gray-700"
            >
              Filter by Category
            </label>
            <select
              id="categoryFilter"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="mt-1 block w-60 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Categories</option>
              {categories.length > 0 &&
                categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            {admin.length > 0 ? (
              <table className="min-w-full bg-gray-100 border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="py-3 px-4 text-left">Image</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Stock</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Description</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admin.map((product) => (
                    <tr key={product._id} className="border-b border-gray-300">
                      <td className="py-2 px-4">
                        <img
                          src={`http://localhost:5000/uploads/${product.image}`}
                          alt={product.name}
                          className="h-16 w-16 object-cover"
                        />
                      </td>
                      <td className="py-2 px-4">{product.name}</td>
                      <td className="py-2 px-4">₹{product.price}</td>
                      <td className="py-2 px-4">{product.stock}</td>
                      <td className="py-2 px-4">{product.category}</td>
                      <td className="py-2 px-4">{product.description}</td>
                      <td className="py-5 flex px-5">
                        <button
                          onClick={() => handleViewClick(product)}
                          className=" py-2 text-xl rounded hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-2"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleUpdateClick(product)}
                          className=" text-blue-600 px-2 text-xl py-2 rounded hover:blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className=" text-red-600 text-2xl py-2 rounded hover:red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <MdDeleteSweep />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500 mt-4">
                No products available.
              </p>
            )}
          </div>

          {/* View Product Modal */}
          {viewProduct && isViewModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 h-3/3 mx-4">
                <h2 className="font-serif font-semibold">Product Details :</h2>
                <img
                  src={`http://localhost:5000/uploads/${viewProduct.image}`}
                  alt={viewProduct.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="text-lg font-semibold mb-4">
                  {viewProduct.name}
                </h3>
                <p className="text-gray-700 mb-4">
                  <strong>Price:</strong> ₹{viewProduct.price}
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Stock:</strong> {viewProduct.stock}
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Description:</strong> {viewProduct.description}
                </p>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="bg-blue-500 text-white ml-96 shadow-lg px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Update Product Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 mx-4">
                <h3 className="text-lg font-semibold mb-4">Update Product</h3>
                <form onSubmit={handleUpdateSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Electronics">All Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothes</option>
                      <option value="Accessories">Toys</option>
                      <option value="Accessories">Google</option>
                      <option value="Accessories">Shoes</option>
                      <option value="Accessories">Chairs</option>
                      <option value="Accessories">Indection</option>
                      <option value="Accessories">Stationary</option>
                      <option value="Accessories">Sandles</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Accessories">Cap</option>
                      <option value="Accessories">Eaebuds Redmi</option>
                      <option value="Accessories">Mens Ring</option>
                      {/* Add other categories as needed */}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Image
                    </label>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {isSubmitting ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;
