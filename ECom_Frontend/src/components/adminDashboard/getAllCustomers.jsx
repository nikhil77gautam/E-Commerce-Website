import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav2 from "../sideNav/nav2";
import { getTotalCustomers } from "../Redux/getTotalCustomerSlice";
import { useDispatch, useSelector } from "react-redux";

const CreatedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const totalCustomers = useSelector(
    (state) => state.getTotalCustomers.totalCustomers
  );
  // console.log(totalCustomers);

  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(getTotalCustomers());
    setLoading(false);
  }, [dispatch]);

  return (
    <div className="flex w-full">
      <div className="flex w-[19%]">
        {/* Side Navigation */}
        <aside className=" bg-gray-800">
          <Nav2 />
        </aside>
      </div>
      <div className="container mx-auto p-5">
        <h2 className="text-3xl bg-gray-200 font-semibold shadow-lg font-serif mb-5 text-center">
          All Customers Who Created' :
        </h2>
        {totalCustomers?.length > 0 ? (
          <div className="overflow-x-auto font-serif">
            <table className="min-w-full table-auto border-collapse border border-gray-200 text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-gray-700">SR NO</th>
                  <th className="border px-4 py-2 text-gray-700">Name</th>
                  <th className="border px-4 py-2 text-gray-700">Email</th>
                  <th className="border px-4 py-2 text-gray-700">Created At</th>
                </tr>
              </thead>
              <tbody>
                {totalCustomers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default CreatedUsers;
