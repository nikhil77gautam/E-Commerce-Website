import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./E-ComNavbar";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLuggageCart } from "react-icons/fa";
import { adminToken, token } from "../server";

const Cart = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    getCartDetail();
  }, []);

  const getCartDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/getCart/${userId}`,
        {
          headers: {
            Authorization: token || adminToken,
          },
        }
      );

      if (response.data && response.data.success && response.data.cart) {
        localStorage.setItem("cartId", response.data.cart._id);
        setProducts(response.data.cart.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error getting cart details:", error);
      toast.error("Failed to fetch cart details.");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/updateCartQuantity/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Quantity updated successfully!");
        getCartDetail();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity.");
    }
  };

  const deleteFromCart = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/deleteFromCart/${id}`,
        {
          headers: {
            Authorization: token,
          },
          data: { userId },
        }
      );

      if (response.status === 200) {
        window.alert("Are you sure want to remove product from cart ?");
        getCartDetail();
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
      window.alert("Failed to remove product.");
    }
  };

  const removeAllProducts = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/removeAllProducts/${userId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        window.alert("All products removed from cart!");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error removing all products from cart:", error);
      window.alert("Failed to remove all products.");
    }
  };

  const proceedToCheckout = () => {
    navigate("/deliveryorder");
  };

  const calculateTotal = () => {
    let totalPrice = 0;
    let totalQuantity = 0;

    products.forEach((item) => {
      totalPrice += item.product.price * item.quantity;
      totalQuantity += item.quantity;
    });

    return { totalPrice, totalQuantity };
  };

  const { totalPrice, totalQuantity } = calculateTotal();

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Nav />

        <div className="flex-grow mx-auto font-serif p-4">
          {products.length > 0 ? (
            <>
              <h2 className="text-3xl font-serif flex py-8 text-green-700 mb-4">
                Your cart is filled with the items you love!
                <FaLuggageCart />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col md:flex-row items-center bg-white shadow-md rounded-lg overflow-hidden"
                  >
                    {item.product.image && (
                      <Link to={`/cart`} className="w-full md:w-1/3">
                        <img
                          src={`http://localhost:5000/uploads/${item.product.image}`}
                          alt={item.product.name}
                          className="w-full h-48 object-contain cursor-pointer"
                        />
                      </Link>
                    )}
                    <div className="p-4 w-full md:w-2/3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-600 my-2">
                        {item.product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-blue-500">
                          {item.product.price} ₹
                        </span>
                        <span className="text-lg font-semibold text-gray-500">
                          Quantity: {item.quantity}
                        </span>
                      </div>
                      <div className="flex items-center mt-4">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(
                              item._id,
                              parseInt(event.target.value) || 1
                            )
                          }
                          className="w-16 text-center border border-gray-300 rounded py-2 px-4"
                          min="1"
                        />
                        <button
                          onClick={() => deleteFromCart(item._id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 ml-4 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col items-center">
                <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Cart Summary
                  </h3>
                  <p className="text-lg font-semibold text-gray-700">
                    Total Quantity:{" "}
                    <span className="font-normal">{totalQuantity}</span>
                  </p>
                  <p className="text-lg font-semibold text-gray-700">
                    Total Price:{" "}
                    <span className="font-normal">{totalPrice} ₹</span>
                  </p>
                </div>
                <div className="mt-6 flex justify-center gap-5">
                  <button
                    onClick={removeAllProducts}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full"
                  >
                    Remove All Products
                  </button>
                  <button
                    onClick={proceedToCheckout}
                    className="bg-blue-500 hover:bg-green-700 text-white py-2 px-4 rounded-full"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-700 text-center py-32 text-4xl font-serif">
              Oops! Your cart is empty. Continue shopping to find something you
              like!
              <i class="bx bxs-shopping-bags bx-tada text-green-600"></i>
            </p>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Cart;
