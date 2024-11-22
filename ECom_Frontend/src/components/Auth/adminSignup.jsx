import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Admin SignUp Only :

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/admin/signup",
        formData
      );

      if (response.status === 201) {
        // Redirect to signin page
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error during admin signup:", error);
      alert("Failed to register. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-700 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-lg"
      >
        <p className="text-2xl font-semibold mb-4 text-white text-center">
          Register as Admin!
        </p>
        <p className="text-yellow-400 mb-6 text-center">
          Welcome aboard! Register to unlock full access and manage your
          dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <label className="flex flex-col flex-1">
            <input
              className="border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label className="flex flex-col mb-4">
          <input
            className="border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="flex flex-col mb-4">
          <input
            className="border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <button
          type="submit"
          className="bg-yellow-500 text-white py-2 px-4 rounded w-full hover:bg-green-500 transition duration-200"
        >
          Submit
        </button>

        <p className="text-white mt-4 text-center">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-white hover:underline"
            onClick={(e) => {
              e.preventDefault();
              navigate("/signin");
            }}
          >
            Signin
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
