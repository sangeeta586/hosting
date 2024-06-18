import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";

const Modal = ({ show, onClose, employee, onUpdate }) => {
  const [formData, setFormData] = useState({ ...employee });

  useEffect(() => {
    setFormData({ ...employee });
  }, [employee]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = () => {
    onUpdate(formData);
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Employee Details</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Branch Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              name="branch_name"
              value={formData.branch_name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Branch State
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              name="branch_state"
              value={formData.branch_state}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Branch City
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              name="branch_city"
              value={formData.branch_city}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Branch Pincode
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              name="branch_pincode"
              value={formData.branch_pincode}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUpdate}
              className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BillingTeamDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/billingTeam/getAllUsers`);
        setEmployees(res.data.users);
      } catch (error) {
        console.error("Error fetching employees", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = async (employeeId) => {
    try {
      await axios.delete(
        `${BASE_URL}/api/billingTeam/delUserbyId/${employeeId}`
      );
      setEmployees(employees.filter((employee) => employee._id !== employeeId));
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  };

  const handleUpdate = async (updatedEmployee) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/billingTeam/updateUserById/${updatedEmployee._id}`,
        updatedEmployee
      );
      setEmployees(
        employees.map((employee) =>
          employee._id === updatedEmployee._id
            ? res.data.updatedEmployee
            : employee
        )
      );
    } catch (error) {
      console.error("Error updating employee", error);
    }
  };

  return (
    <div className="w-full p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">BillTeam Details</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branch Name
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branch State
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branch City
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branch Pincode
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td className="py-4 px-4 whitespace-nowrap">{employee.name}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {employee.email}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {employee.phone}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {employee.address}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {employee.branch_name}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {employee.branch_state}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {employee.branch_city}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {employee.branch_pincode}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          employee={selectedEmployee}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default BillingTeamDetails;
