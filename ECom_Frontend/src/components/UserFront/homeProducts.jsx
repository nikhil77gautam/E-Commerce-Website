import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CarouselSlider from "./Slider";
import EComNavbar from "./E-ComNavbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../Redux/getProductSlice";
import { getAllCategories } from "../Redux/getAllCategoriesSlice";
import { FaCartArrowDown } from "react-icons/fa";

const AllProductDetail = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [quantities, setQuantities] = useState({});

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const dispatch = useDispatch();
  const allCategories = useSelector(
    (state) => state.getAllCategories.allCategories
  );

  useEffect(() => {
    dispatch(getAllCategories());
    getProductDetails(selectedCategory);
  }, [dispatch, selectedCategory]);

  const getProductDetails = async (category) => {
    try {
      const endpoint =
        category === "All"
          ? "http://localhost:5000/getAllProducts"
          : `http://localhost:5000/category/${category}`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setProducts(response.data.products || []);
      const initialQuantities = {};
      response.data.products.forEach((product) => {
        initialQuantities[product._id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error("Error getting product details:", error);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleIncrement = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 1) + 1,
    }));
  };

  const handleDecrement = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(1, (prevQuantities[productId] || 1) - 1),
    }));
  };

  const addToCart = async (productId) => {
    try {
      const obj = {
        userId: userId,
        productId,
        quantity: quantities[productId] || "1",
      };

      const response = await axios.post(
        "http://localhost:5000/addToCart",
        obj,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setCart([...cart, response.data.cartProduct]);
      window.alert("Product successfully added to cart");
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="m-auto">
        <EComNavbar />
        <CarouselSlider />

        <div className="p-4">
          {/* Category Filter */}
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
              <option value="All">All Products</option>
              {allCategories.length > 0 &&
                allCategories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-between h-full"
                >
                  {product.image && (
                    <Link to={`/product/${product._id}`} className="w-full">
                      <img
                        src={`http://localhost:5000/uploads/${product.image}`}
                        alt={product.name}
                        className="rounded-lg w-full h-60 hover:border-x hover object-contain mb-4"
                      />
                    </Link>
                  )}
                  <h1 className="text-lg font-bold text-gray-800 text-center">
                    {product.name}
                  </h1>
                  <p className="text-gray-700 my-2 text-center text-sm">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between w-full mt-4">
                    <span className="text-lg font-bold text-blue-500">
                      ₹{product.price}
                    </span>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleDecrement(product._id)}
                        className="px-3 py-1 bg-red-600 rounded-l"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantities[product._id] || 1}
                        readOnly
                        className="w-10 text-center border-t border-b border-gray-300 py-1 px-2"
                        min="1"
                      />
                      <button
                        onClick={() => handleIncrement(product._id)}
                        className="px-3 py-1 bg-green-600 rounded-r"
                      >
                        +
                      </button>
                      <button
                        onClick={() => addToCart(product._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 ml-4 rounded"
                      >
                        <FaCartArrowDown />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full font-serif text-center text-gray-500">
                No products found in this category
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProductDetail;
