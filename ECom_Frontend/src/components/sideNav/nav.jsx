// import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { GrUserAdmin } from "react-icons/gr";
// import {
//   FaSignOutAlt,
//   FaChevronDown,
//   FaChevronUp,
//   FaBars,
//   FaTimes,
//   FaUserFriends,
// } from "react-icons/fa";
// import { FcCustomerSupport } from "react-icons/fc";
// import { MdProductionQuantityLimits, MdStreetview } from "react-icons/md";
// import { TbCategoryPlus } from "react-icons/tb";
// import income from "../../assets/income.png";
// import spending from "../../assets/spending.png";

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
//   const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] =
//     useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const productsDropdownRef = useRef(null);
//   const categoriesDropdownRef = useRef(null);

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("userName");
//     localStorage.removeItem("role");
//     localStorage.removeItem("userId");
//     navigate("/signin");
//   };

//   const toggleProductsDropdown = () => {
//     setIsProductsDropdownOpen((prev) => !prev);
//   };

//   const toggleCategoriesDropdown = () => {
//     setIsCategoriesDropdownOpen((prev) => !prev);
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         productsDropdownRef.current &&
//         !productsDropdownRef.current.contains(event.target)
//       ) {
//         setIsProductsDropdownOpen(false);
//       }
//       if (
//         categoriesDropdownRef.current &&
//         !categoriesDropdownRef.current.contains(event.target)
//       ) {
//         setIsCategoriesDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     const handleClickOutsideSidebar = (event) => {
//       if (
//         isSidebarOpen &&
//         !document.querySelector(".sidebar").contains(event.target) &&
//         !document.querySelector(".hamburger").contains(event.target)
//       ) {
//         setIsSidebarOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutsideSidebar);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutsideSidebar);
//     };
//   }, [isSidebarOpen]);

//   return (
//     <>
//       {/* Mobile Header */}
//       <header className="md:hidden flex items-center justify-between bg-gray-800 text-white p-4">
//         <h2 className="text-lg font-bold flex items-center">
//           Admin Dashboard <GrUserAdmin className="ml-2" />
//         </h2>
//         <button
//           onClick={toggleSidebar}
//           className="hamburger text-white focus:outline-none"
//         >
//           {isSidebarOpen ? (
//             <FaTimes className="text-2xl" />
//           ) : (
//             <FaBars className="text-2xl" />
//           )}
//         </button>
//       </header>

//       {/* Sidebar */}
//       <aside
//         className={`sidebar bg-gray-800 text-white flex flex-col transition-transform duration-300 ease-in-out transform ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0 md:w-64 md:flex-shrink-0`}
//       >
//         <div className="p-6 hidden md:block">
//           <Link to="/admin">
//             <h2 className="text-lg font-bold mb-4 flex items-center cursor-pointer">
//               Admin Dashboard <GrUserAdmin className="ml-2" />
//             </h2>
//           </Link>
//         </div>
//         <nav className="flex-1 overflow-y-auto">
//           <ul className="space-y-4 p-6">
//             {/* Products Dropdown */}
//             <li ref={productsDropdownRef}>
//               <button
//                 onClick={toggleProductsDropdown}
//                 className="w-full flex items-center justify-between py-2 px-3 font-serif bg-gray-600 rounded hover:bg-gray-700"
//               >
//                 <MdProductionQuantityLimits /> Products
//                 {isProductsDropdownOpen ? (
//                   <FaChevronUp className="ml-2" />
//                 ) : (
//                   <FaChevronDown className="ml-2" />
//                 )}
//               </button>
//               {isProductsDropdownOpen && (
//                 <ul className="mt-2 space-y-2 ml-4">
//                   <li>
//                     <Link
//                       to="/createProduct"
//                       className="block py-2 px-3 font-serif bg-gray-600 rounded hover:bg-gray-700"
//                     >
//                       Add Products ➤
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/productsList"
//                       className="block py-2 px-3 font-serif bg-gray-600 rounded hover:bg-gray-700"
//                     >
//                       Get All Products ➤
//                     </Link>
//                   </li>
//                 </ul>
//               )}
//             </li>

//             {/* Categories Dropdown */}
//             <li ref={categoriesDropdownRef}>
//               <button
//                 onClick={toggleCategoriesDropdown}
//                 className="w-full flex items-center justify-between py-2 px-3 font-serif bg-gray-600 rounded hover:bg-gray-700"
//               >
//                 <TbCategoryPlus /> Categories
//                 {isCategoriesDropdownOpen ? (
//                   <FaChevronUp className="ml-2" />
//                 ) : (
//                   <FaChevronDown className="ml-2" />
//                 )}
//               </button>
//               {isCategoriesDropdownOpen && (
//                 <ul className="mt-2 space-y-2 ml-4">
//                   <li>
//                     <Link
//                       to="/getcategories"
//                       className="block py-2 px-3 font-serif bg-gray-600 rounded hover:bg-gray-700"
//                     >
//                       Get All Categories ➤
//                     </Link>
//                   </li>
//                 </ul>
//               )}
//             </li>

//             <li>
//               <Link
//                 to="/getAllOrders"
//                 className="block flex items-center gap-2 py-2 font-serif px-3 bg-gray-600 rounded hover:bg-gray-700"
//               >
//                 <MdStreetview /> Manage Orders ➤
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/support"
//                 className="block py-2 flex items-center gap-2 font-serif px-3 bg-gray-600 rounded hover:bg-gray-700"
//               >
//                 <FcCustomerSupport /> Contact Support
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/users"
//                 className="block py-2 flex items-center gap-2 font-serif px-3 bg-gray-600 rounded hover:bg-gray-700"
//               >
//                 <FaUserFriends /> Created Customers
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/income"
//                 className="block py-2 flex items-center gap-2 font-serif px-3 bg-gray-600 rounded hover:bg-gray-700"
//               >
//                 <img src={income} alt="" className="w-6 h-6" />
//                 Income
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/expense"
//                 className="block py-2 flex items-center gap-2 font-serif px-3 bg-gray-600 rounded hover:bg-gray-700"
//               >
//                 <img src={spending} alt="" className="w-6 h-6" />
//                 Expense
//               </Link>
//             </li>
//             <li>
//               <button
//                 onClick={handleLogout}
//                 className="block w-full py-3 px-3 bg-red-700 rounded hover:bg-red-500 flex items-center justify-start"
//               >
//                 <FaSignOutAlt className="mr-2" /> Logout
//               </button>
//             </li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Overlay for mobile */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-50 md:hidden"
//           onClick={toggleSidebar}
//         ></div>
//       )}
//     </>
//   );
// };

// export default Sidebar;
