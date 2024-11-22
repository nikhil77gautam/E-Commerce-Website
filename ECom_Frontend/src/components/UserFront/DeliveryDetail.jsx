import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { token } from "../server";

const MyDeliveryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mob: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  // const token = localStorage.getItem("token");

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [cart, setCart] = useState([]);
  const userId = localStorage.getItem("userId") || "";
  const cartId = localStorage.getItem("cartId") || "";

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch countries
    setCountries(Country.getAllCountries());

    // Load cart items from local storage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setFormData({ ...formData, country: countryCode, state: "", city: "" });

    const statesOfCountry = State.getStatesOfCountry(countryCode);
    setStates(statesOfCountry);
    setCities([]);
  };

  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setFormData({ ...formData, state: stateCode, city: "" });

    const citiesOfState = City.getCitiesOfState(formData.country, stateCode);
    setCities(citiesOfState);
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setFormData({ ...formData, city: cityName });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for postal code
    if (formData.postalCode.length !== 6) {
      Swal.fire({
        title: "Invalid Postal Code",
        text: "Postal Code must be exactly 6 digits.",
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }

    if (!token) {
      Swal.fire({
        title: "Authentication Error",
        text: "User not authenticated. Please log in again.",
        icon: "error",
        confirmButtonText: "Okay",
      });
      return;
    }
    try {
      console.log(userId);
      const response = await axios.post(
        "http://localhost:5000/placeOrder",
        {
          userId: userId,
          cartId: cartId,
          name: formData.name,
          email: formData.email,
          mobile: formData.mob,
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postalCode: formData.postalCode,
          },
        },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        Swal.fire({
          title: "Order Placed!",
          text: "Your order has been placed successfully.",
          icon: "success",
          confirmButtonText: "Great!",
        }).then(() => {
          navigate("/orderhistory");
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container font-serif mx-auto my-20 px-4 md:px-0">
      <form
        className="max-w-3xl bg-gradient-to-r from-yellow-400 to-gray-500 mx-auto shadow-md p-8 shadow-slate-500 rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center mb-6">
          <i className="bx bxs-truck bx-fade-left text-3xl text-green-800 mr-4"></i>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Delivery Details :
            </h2>
            <p className="text-gray-500">Trace your order</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <label className="block">
            <span className="block text-lg font-medium text-gray-700">
              Name
            </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-2 h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="John Doe"
              required
            />
          </label>

          <label className="block">
            <span className="block text-lg font-medium text-gray-700">
              Email
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-2 h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="johndoe@example.com"
              required
            />
          </label>

          <label className="block">
            <span className="block text-lg font-medium text-gray-700">
              Contact Number
            </span>
            <input
              type="tel"
              name="mob"
              value={formData.mob}
              onChange={handleChange}
              className="mt-1 block w-full px-2 h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="+1 234 567 890"
              required
            />
          </label>

          <label className="block">
            <span className="block text-lg font-medium text-gray-700">
              Street Address
            </span>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="mt-1 block w-full px-2 h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="1234 Main St"
              required
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <label className="block">
            <span className="block text-lg font-medium text-gray-700">
              Country
            </span>
            <select
              name="country"
              value={formData.country}
              onChange={handleCountryChange}
              className="mt-1 block w-full px-2 h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-lg font-medium text-gray-700">
              State/Province
            </span>
            <select
              name="state"
              value={formData.state}
              onChange={handleStateChange}
              className="mt-1 block w-full px-2 h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-lg px-2 font-medium text-gray-700">
              City
            </span>
            <select
              name="city"
              value={formData.city}
              onChange={handleCityChange}
              className="mt-1 block w-full px-2 h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-lg font-medium text-gray-700">
              Postal Code
            </span>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="mt-1 block w-full px-2 h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="123456"
              required
            />
          </label>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-40 rounded shadow-2xl transition-all duration-200"
          >
            Place Order...
          </button>
        </div>
        {/* Thank you message */}
        <span className="text-center text-3xl block mt-6 text-gray-700">
          Thank you for taking your time to choose us!
        </span>
      </form>
    </div>
  );
};

export default MyDeliveryForm;
