import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import Nav2 from "../sideNav/nav2";
import { MdDeleteSweep } from "react-icons/md";
import { adminToken } from "../server";

const SupportMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  // const token = localStorage.getItem("token");

  // Fetch all support messages
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/support-messages",
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      );
      setMessages(response.data.data);
      setFilteredMessages(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages", error);
      toast.error("Failed to load messages.");
      setLoading(false);
    }
  };

  // Update message status with SweetAlert confirmation
  const updateMessageStatus = async (id, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to change the status to "${status}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(
            `http://localhost:5000/support-messages/${id}`,
            { status },
            {
              headers: {
                Authorization: `${adminToken}`,
              },
            }
          );
          Swal.fire("Updated!", "The status has been updated.", "success");
          fetchMessages();
        } catch (error) {
          console.error("Error updating status", error);
          toast.error("Failed to update status.");
        }
      }
    });
  };

  // Delete a message with SweetAlert confirmation
  const deleteMessage = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/support-messages/${id}`, {
            headers: {
              Authorization: `${adminToken}`,
            },
          });
          Swal.fire("Deleted!", "The message has been deleted.", "success");
          fetchMessages();
        } catch (error) {
          console.error("Error deleting message", error);
          toast.error("Failed to delete message.");
        }
      }
    });
  };

  // Filter messages based on status
  const filterMessages = (status) => {
    setFilterStatus(status);
    if (status === "all") {
      setFilteredMessages(messages);
    } else {
      setFilteredMessages(messages.filter((msg) => msg.status === status));
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="flex w-full">
      <div className="flex w-[19%]">
        {/* Side Navigation */}
        <aside className=" bg-gray-800">
          <Nav2 />
        </aside>
      </div>
      <div className="container mx-auto mt-8 p-4">
        <h2 className="text-2xl bg-gray-200 text-center shadow-lg font-semibold font-serif mb-6">
          Support Messages' :
        </h2>

        {/* Filter Buttons */}
        <div className="mb-6 font-serif font-bold text-center">
          <button
            className={`px-6 py-2 mr-2 rounded-lg ${
              filterStatus === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => filterMessages("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 mr-2 rounded-lg ${
              filterStatus === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => filterMessages("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 mr-2 rounded-lg ${
              filterStatus === "resolved"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => filterMessages("resolved")}
          >
            Resolved
          </button>
          <button
            className={`px-4 py-2 mr-2 rounded-lg ${
              filterStatus === "closed"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => filterMessages("closed")}
          >
            Closed
          </button>
        </div>

        <div className="overflow-x-auto font-serif">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700 text-white text-left">
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Message</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((message) => (
                <tr key={message._id} className="border-t border-gray-200">
                  <td className="px-6 py-4">{message.user}</td>
                  <td className="px-6 py-4">{message.subject}</td>
                  <td className="px-6 py-4">{message.message}</td>
                  <td className="px-6 py-4">
                    <select
                      value={message.status || "pending"}
                      onChange={(e) =>
                        updateMessageStatus(message._id, e.target.value)
                      }
                      className="p-2 border rounded bg-gray-50 focus:ring focus:ring-indigo-200"
                    >
                      <option
                        className=" text-yellow-600 text-lg "
                        value="pending"
                      >
                        Pending
                      </option>
                      <option
                        className=" text-green-600  text-lg"
                        value="resolved"
                      >
                        Resolved
                      </option>
                      <option className=" text-red-600  text-lg" value="closed">
                        Closed
                      </option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteMessage(message._id)}
                      className="text-3xl hover:text-red-700 text-red-600 font-bold py-2 px-4 rounded"
                    >
                      <MdDeleteSweep />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupportMessages;
