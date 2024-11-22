import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import Nav2 from "../../components/sideNav/nav2";
import { token, adminToken } from "../server";

const ProductByCategory = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const { category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductsByCategory();
  }, [category]);

  const fetchProductsByCategory = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/products/category",
        { category: category },
        {
          headers: {
            Authorization: `${token || adminToken}`,
          },
        }
      );
      setProducts(response.data.products);
      setError("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No products found in this category.");
        setProducts([]);
      } else {
        setError("An error occurred while fetching products.");
      }
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex w-[18%]">
        {/* Side Navigation */}
        <aside className=" bg-gray-800">
          <Nav2 />
        </aside>
      </div>
      {/* Main Content */}
      <div className="mx-auto p-4 w-full md:w-3/4 lg:w-4/5">
        {/* Breadcrumb Navigation */}
        <nav className="text-gray-500 mb-6">
          <ol className="list-reset font-serif font-semibold flex">
            <li>
              <Link to="/admin" className="text-blue-500 hover:text-blue-700">
                Dashboard
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link
                to="/getcategories"
                className="text-blue-500 hover:text-blue-700"
              >
                Back
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-700">{category}</li>
          </ol>
        </nav>
        <div className="backgroundgif">
          <img src="" alt="" />
          <h2 className="text-3xl font-serif shadow-lg bg-gray-200 font-semibold text-center mb-6 text-gray-800">
            Products by Category: {category}
          </h2>

          {/* Error or Products */}
          <div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={`http://localhost:5000/uploads/${product.image}`}
                      alt={product.name}
                      className="h-40 w-full object-contain mb-4 rounded-md"
                    />
                    <h3 className="text-xl font-serif font-semibold mb-2 text-gray-700">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 font-serif mb-1">
                      Category: {product.category}
                    </p>
                    <p className="text-gray-800 font-serif font-medium">
                      Price: ₹{product.price}
                    </p>
                    <p className="text-gray-800 font-serif font-medium">
                      Stock: {product.stock}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              !error && (
                <p className="text-center text-gray-500">
                  Please select a category to view products.
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductByCategory;
