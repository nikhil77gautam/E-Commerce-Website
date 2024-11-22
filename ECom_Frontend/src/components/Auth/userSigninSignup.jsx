import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  token,
  userId,
  userName,
  role,
  adminToken,
  adminId,
  adminRole,
  adminName,
} from "../server";

// User Register Only:
const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
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
      // API request for signup
      const response = await axios.post(
        "http://localhost:5000/userSignup",
        formData
      );
      console.log(response);
      navigate("/signin");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://t4.ftcdn.net/jpg/02/16/47/33/360_F_216473351_FCLq1pZQOBFrgcyPBphKvBd8Z5wjD1dI.jpg')",
        }}
      ></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 bg-black bg-opacity-50">
        <form
          onSubmit={handleSubmit}
          className="bg-transparent border shadow-2xl p-6 sm:p-8 rounded-lg shadow-md w-full max-w-lg"
        >
          <p className="text-2xl font-semibold mb-4 text-white text-center">
            Register!
          </p>
          <p className="text-yellow-400 mb-6 text-center">
            Welcome aboard! Register to unlock full access and start your
            journey with us.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <label className="flex flex-col text-gray-200 flex-1">
              {" "}
              Name
              <input
                className="border rounded text-black py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label className="flex flex-col text-gray-200 mb-4">
            {" "}
            Email
            <input
              className="border rounded text-black py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="flex flex-col text-gray-200 mb-4">
            {" "}
            Password
            <input
              className="border rounded text-black py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
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
    </>
  );
};

// Admin and User signin only:
const SignInForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignin = async (e) => {
    e.preventDefault();

    try {
      // API request for signin
      const response = await axios.post("http://localhost:5000/signin", {
        email,
        password,
      });

      const { token, user } = response.data;
      const { role, userId, name } = user;

      // Redirect based on role
      if (role === "admin") {
        // Set admin data in localStorage
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminId", adminId);
        localStorage.setItem("adminRole", role);
        localStorage.setItem("adminName", name);
        navigate("/admin");
      } else if (role === "customer") {
        // Set user data in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", name);

        navigate("/");
      }
    } catch (error) {
      console.error("Signin failed:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://static.vecteezy.com/system/resources/previews/014/468/621/non_2x/abstract-digital-technology-background-with-concept-security-vector.jpg')",
        }}
      ></div>
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 bg-black bg-opacity-50">
        {" "}
        <form
          onSubmit={handleSignin}
          className="bg-transparent border shadow-2xl p-6 sm:p-8 rounded-lg shadow-md w-full max-w-lg"
        >
          <p className="text-2xl font-semibold mb-4 text-center text-white">
            Sign In
          </p>
          <p className="text-yellow-400 mb-6 text-center">
            Welcome back! Please sign in to continue your journey with us.
          </p>

          <div className="flex flex-col mb-4">
            <label htmlFor="email" className="mb-2 text-gray-200">
              Email
            </label>
            <input
              id="email"
              placeholder="Enter your email"
              className="border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col mb-4">
            <label htmlFor="password" className="mb-2 text-gray-200">
              Password
            </label>
            <input
              id="password"
              placeholder="Enter your password"
              className="border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input type="checkbox" id="rememberMe" className="mr-2" />
              <label htmlFor="rememberMe" className="text-white">
                Remember me
              </label>
            </div>
            <span className="text-white cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            className="bg-yellow-500 text-white py-2 px-4 rounded w-full hover:bg-green-500 transition duration-200"
          >
            Sign In
          </button>

          <p className="text-white mt-4 text-center">
            Don't have an account?{" "}
            <Link
              to="/userSignup"
              className="text-white cursor-pointer hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export { RegisterForm, SignInForm };
