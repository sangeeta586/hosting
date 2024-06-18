import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import BillingTeamDetails from "../BillingTeam/BillingTeamDetails";
import { BASE_URL } from "../../constants";

const BillingRegistrationModal = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    branch_name: "",
    branch_state: "",
    branch_city: "",
    branch_pincode: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null); // For displaying errors

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/billingTeam/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Registration successful");
        setIsModalOpen(false); // Close the modal on successful registration
        navigate("/billingTeamRegister");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="lg:flex block">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center mb-4 flex-col">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded h-8 mr-2"
          >
            Open Billing Registration Form
          </button>
          <BillingTeamDetails />
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg mx-2 sm:mx-4 md:mx-6 lg:mx-auto xl:mx-auto">
              <h2 className="text-2xl font-bold mb-4">
                Register for Billing Team
              </h2>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <form onSubmit={handleSubmit} className="w-full">
                {[
                  { label: "Name", name: "name", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Password", name: "password", type: "password" },
                  { label: "Phone", name: "phone", type: "text" },
                  { label: "Address", name: "address", type: "text" },
                  { label: "Branch Name", name: "branch_name", type: "text" },
                  { label: "Branch State", name: "branch_state", type: "text" },
                  { label: "Branch City", name: "branch_city", type: "text" },
                  {
                    label: "Branch Pincode",
                    name: "branch_pincode",
                    type: "text",
                  },
                ].map((field, index) => (
                  <div className="mb-4" key={index}>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor={field.name}
                    >
                      {field.label}
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id={field.name} // Ensure id is unique
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingRegistrationModal;
