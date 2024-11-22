import React, { useState } from "react";
import { FcCustomerSupport } from "react-icons/fc";
import "boxicons";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("");
  const token = localStorage.getItem("token");

  // Handle modal open/close
  const handleSupportClick = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormStatus("");
  };

  // Handle form data change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/contact-support",
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 201) {
        setFormStatus("Message sent successfully!");
        toast.success("Your query was successfully submitted!");
        setFormData({
          name: "",
          subject: "",
          message: "",
        });
        handleCloseModal();
      } else {
        setFormStatus("Something went wrong. Please try again.");
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setFormStatus("Error sending message. Please try again later.");
      toast.error("Error sending message. Please try again later.");
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-10 w-full">
      <div className="mx-auto text-balance px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="">
            <h2 className="text-lg font-bold mb-4 text-yellow-400 font-serif">
              <i className="bx bxs-info-circle text-gray-200"></i> About Us:
            </h2>
            <p className="text-lg text-balance font-serif leading-relaxed">
              Discover a seamless shopping experience where quality meets
              convenience, bringing you closer to what you love, effortlessly.
              Explore our curated selection of products designed to elevate
              every moment, offering unparalleled ease and satisfaction.
            </p>
          </div>
          <div className="">
            <h2 className="text-lg font-bold mb-4 text-yellow-400 font-serif">
              <i className="bx bxs-contact text-gray-200"></i> Contact Us:
            </h2>
            <div className="text-lg font-serif leading-relaxed cursor-pointer">
              <div
                className="flex items-center mb-2"
                onClick={handleSupportClick}
              >
                <FcCustomerSupport className="mr-2" />
                <p className="hover:underline">Contact Support</p>
              </div>
              <i className="bx bxl-gmail bx-tada text-red-500"></i>{" "}
              <a href="mailto:shopKro@gmail.com">shopKro@gmail.com</a>
              <br />
              <i className="bx bxs-phone-call bx-tada text-blue-500"></i>{" "}
              <a href="tel:+9630741589">9630741589</a>
              <br />
              <i className="bx bxs-map bx-tada text-red-500"></i> 123,
              Janjeerwala Square, Indore Madhya Pradesh, INDIA
            </div>
          </div>
          <div className="">
            <h2 className="text-lg font-bold mb-4 text-yellow-400 font-serif">
              <i className="bx bx-globe text-gray-200"></i> Connect With Us:
            </h2>
            <p className="text-lg font-serif leading-relaxed">
              <i className="bx bxl-instagram-alt bx-tada text-purple-500 cursor-pointer"></i>{" "}
              Instagram
              <br />
              <i className="bx bxl-facebook-circle bx-tada text-blue-500 cursor-pointer"></i>{" "}
              Facebook
              <br />
              <i className="bx bxl-twitter bx-tada text-blue-500 cursor-pointer"></i>{" "}
              Twitter
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center md:text-left">
          <p className="text-sm text-center font-serif">
            &copy; 2024 ShopKro.com. All rights reserved.
          </p>
        </div>
      </div>

      {/* Modal for Contact Support */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Contact Support
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter your Subject"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="How can we help?"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast notification container */}
      <ToastContainer />
    </footer>
  );
};

export default Footer;
