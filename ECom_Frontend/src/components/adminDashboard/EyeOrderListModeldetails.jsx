import React from "react";
import { FcViewDetails } from "react-icons/fc";

const Modal = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-80 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold flex items-center">
            Order Details
            <FcViewDetails className="ml-2" />
          </h2>
          <button
            onClick={onClose}
            className="text-red-700 hover:text-red-600 text-3xl transition duration-150 ease-in-out"
          >
            <i class="bx bxs-x-circle bx-tada"></i>
          </button>
        </div>
        <p>
          <strong>Name:</strong> {order.name}
        </p>
        <p>
          <strong>Email:</strong> {order.email}
        </p>
        <p>
          <strong>Phone:</strong> {order.mobile}
        </p>

        {order.shippingAddress && (
          <>
            <h3 className="text-xl font-semibold mt-4">Shipping Address:</h3>
            <ul className="list-disc ml-6 mb-4">
              <li>
                <strong>City:</strong> {order.shippingAddress.city}
              </li>
              <li>
                <strong>Country:</strong> {order.shippingAddress.country}
              </li>
              <li>
                <strong>State:</strong> {order.shippingAddress.state}
              </li>
              <li>
                <strong>Street:</strong> {order.shippingAddress.street}
              </li>
              <li>
                <strong>Postal Code:</strong> {order.shippingAddress.postalCode}
              </li>
            </ul>
          </>
        )}

        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <h3 className="text-xl font-semibold mt-4">Ordered Products:</h3>
        <ul className="list-disc ml-6">
          {order.cartProducts.length > 0 ? (
            order.cartProducts.map((cartProduct, index) => (
              <li key={index}>
                {cartProduct.product ? (
                  <>
                    <span className="font-semibold">
                      {cartProduct.product.name}
                    </span>{" "}
                    - Quantity: {cartProduct.quantity}
                  </>
                ) : (
                  <span>Product details not available</span>
                )}
              </li>
            ))
          ) : (
            <li>No products in this order</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Modal;
