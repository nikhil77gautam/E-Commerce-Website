import React, { useEffect, useState } from "react";
import EComNavbar from "./E-ComNavbar";
import Footer from "./Footer";
import { getuserAllOrder } from "../Redux/userGetAllOrdersSlice";
import { useDispatch, useSelector } from "react-redux";

const OrderHistory = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const getUserAllOrders = useSelector(
    (state) => state.getUserAllOrder.userAllOrder
  );

  const orders = getUserAllOrders || [];

  useEffect(() => {
    dispatch(getuserAllOrder());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <EComNavbar />
      <div className="container mx-auto my-8 px-4 md:px-6 lg:px-8 flex-grow">
        <h2 className="text-2xl font-bold mb-6 text-yellow-600 font-serif text-center">
          Order Summary:
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {orders.length === 0 ? (
          <p className="text-center">No orders found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-300 rounded-lg p-6 shadow-lg bg-white"
              >
                <div className="mb-6 text-center">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Order #{order._id} -{" "}
                    <span className="text-green-600">{order.status}</span>
                  </h3>
                  <p className="text-sm text-red-500">
                    Order Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="font-semibold">Customer Details:</p>
                    <p>Name: {order.name}</p>
                    <p>Email: {order.email}</p>
                    <p>Mobile: {order.mobile}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Shipping Address:</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}
                    </p>
                    <p>
                      {order.shippingAddress.country} -{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                  </div>
                </div>

                <ul className="space-y-4">
                  {order.cartProducts.map((product, index) => (
                    <li
                      key={index}
                      className="flex flex-col sm:flex-row items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-300"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden bg-white p-2">
                        <img
                          src={`http://localhost:5000/uploads/${product.product.image}`}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 mx-4 text-center sm:text-left">
                        <h4 className="text-lg font-medium text-gray-800">
                          {product.productName}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {product.productDescription}
                        </p>
                      </div>

                      {/* Quantity and Price */}
                      <div className="text-center sm:text-right bg-white p-3 border border-gray-200 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700">
                          Qty: {product.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gray-700">
                          Price: ₹{product.price.toFixed(2)}
                        </p>
                        <p className="text-sm font-bold text-red-600">
                          Subtotal: ₹
                          {(product.price * product.quantity).toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <p className="font-bold font-serif mt-6 text-red-600 text-right">
                  Total Amount: ₹
                  {order.cartProducts
                    .reduce(
                      (total, product) =>
                        total + product.price * product.quantity,
                      0
                    )
                    .toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderHistory;
