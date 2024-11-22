import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsFillCartCheckFill } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
// import Devileryman from "../../assets/delivery-man.png";
import { IoBagCheckOutline } from "react-icons/io5";
import "boxicons";
import { token, userId } from "../server";
import axios from "axios";

const Navbar = ({ setData, cart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [cartLength, setCartLength] = useState();

  const userName = localStorage.getItem("userName");

  useEffect(() => {
    getCartDetail();
    const loggedinUser = localStorage.getItem("token");

    if (loggedinUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/${search}`);
    setSearch("");
  };

  const getCartDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/getCart/${userId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data && response.data.success && response.data.cart) {
        localStorage.setItem("cartId", response.data.cart._id);

        setCartLength(response.data.cart.products.length);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error getting cart details:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    navigate("/signin");
  };

  return (
    <header className="sticky top-0 bg-gray-800 text-white shadow-md z-10">
      <div className="flex flex-wrap justify-between items-center p-4 max-w-7xl mx-auto">
        <Link
          to="/"
          className="text-2xl font-bold text-yellow-400 font-serif mb-2 sm:mb-0"
        >
          <i className="bx bx-shopping-bag bx-fade-left bx-rotate-180"></i>
          ShopKro.Com
        </Link>

        <div className="flex flex-wrap items-center space-x-4 mb-2 sm:mb-0">
          <form
            onSubmit={handleSubmit}
            className="flex flex-grow mb-2 sm:mb-0 hidden sm:flex"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search Your Products >"
              className="px-4 py-2 rounded-l-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 font-serif w-full sm:w-auto"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-r-lg font-serif"
            >
              Search
            </button>
          </form>

          <Link to="/cart" className="relative flex items-center mb-2 sm:mb-0">
            <BsFillCartCheckFill className="text-2xl" />
            <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {cartLength}
              {/* {console.log(cartLength)} */}
            </span>
          </Link>

          {/* Orders Button */}

          <Link
            to="/orderhistory"
            className="flex items-center text-lg bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-serif"
          >
            <IoBagCheckOutline />
          </Link>

          <div className="relative">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setNavOpen(!navOpen)}
            >
              <FontAwesomeIcon
                icon={faUser}
                className="text-white text-2xl text-left"
              />
              {isLoggedIn && <span className="ml-2 text-sm">{userName}</span>}
            </div>
            {navOpen && (
              <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg py-2 z-50">
                {isLoggedIn ? (
                  <>
                    <button
                      className="block px-4 text-yellow-500 hover:bg-gray-200 w-full text-right"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/signin"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
