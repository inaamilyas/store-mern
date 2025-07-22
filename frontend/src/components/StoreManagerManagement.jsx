import axios from 'axios';
import { useState, useEffect } from 'react';

const StoreManagerManagement = ({
  storeManagers,
  setStoreManagers,
  stores,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentManager, setCurrentManager] = useState(null); // For editing

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Only for new managers
  const [role, setRole] = useState('manager'); // Default role
  const [storeId, setStoreId] = useState(''); // Store linked to manager

  // useEffect(() => {
  //   if (currentManager) {
  //     setName(currentManager.name);
  //     setEmail(currentManager.email);
  //     setPassword(''); // Password is not editable directly for security
  //     setRole(currentManager.role || 'storeManager');
  //     setStoreId(currentManager.storeId || '');
  //   } else {
  //     setName('');
  //     setEmail('');
  //     setPassword('');
  //     setRole('storeManager');
  //     setStoreId('');
  //   }
  // }, [currentManager]);

  const openModal = (manager = null) => {
    setCurrentManager(manager);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentManager(null);
  };

  const _handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, password would be hashed and stored securely in backend
    const managerData = { name, email, role, storeId };
    if (currentManager) {
      // For updates, password is not changed via this form
      setStoreManagers(
        storeManagers.map((sm) =>
          sm.id === currentManager.id ? { ...sm, ...managerData } : sm,
        ),
      );
    } else {
      // For new managers, include the password
      setStoreManagers([
        ...storeManagers,
        { ...managerData, id: generateId(), password: password },
      ]);
    }
    closeModal(); // Close modal after submission
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const managerData = {
      name,
      email,
      role,
      store_id: storeId, // assuming storeId is store._id
    };

    if (!currentManager) {
      managerData.password = password;
    }

    try {
      if (currentManager) {
        // UPDATE existing manager
        const res = await axios.put(
          `http://localhost:5000/api/users/${currentManager._id}`,
          managerData,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        // Optional: update UI list of managers
        setStoreManagers((prev) =>
          prev.map((m) => (m._id === res.data._id ? res.data : m)),
        );
      } else {
        // ADD new manager
        const res = await axios.post(
          `http://localhost:5000/api/users`,
          managerData,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        // Optional: append new manager to UI
        setStoreManagers((prev) => [...prev, { name, email, role }]);
      }

      // Reset form and close modal
      setName('');
      setEmail('');
      setPassword('');
      setRole('storeManager');
      setStoreId('');
      setCurrentManager(null);
      closeModal();
    } catch (err) {
      console.error(
        'Error submitting manager:',
        err.response?.data || err.message,
      );
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-gray-700">
          Manage Store Managers
        </h3>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Add New Manager
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Email
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Role
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Assigned Store
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {storeManagers.map((manager) => (
              <tr
                key={manager.id}
                className="border-b border-gray-200 last:border-b-0"
              >
                <td className="py-3 px-4 text-gray-800">{manager.name}</td>
                <td className="py-3 px-4 text-gray-800">{manager.email}</td>
                <td className="py-3 px-4 text-gray-800">{manager.role}</td>
                <td className="py-3 px-4 text-gray-800">
                  {manager.storeId || 'N/A'}
                </td>
                <td className="py-3 px-4 flex space-x-2">
                  <button
                    onClick={() => openModal(manager)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setStoreManagers(
                        storeManagers.filter((sm) => sm.id !== manager.id),
                      )
                    } // Corrected function name
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Store Manager */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {currentManager ? 'Edit Store Manager' : 'Add New Store Manager'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="managerName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="managerName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="managerEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="managerEmail"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {!currentManager && ( // Only show password field for new managers
                <div>
                  <label
                    htmlFor="managerPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="managerPassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!currentManager}
                  />
                </div>
              )}
              <div>
                <label
                  htmlFor="managerRole"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="managerRole"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="storeManager">Store Manager</option>
                  {/* <option value="admin">Admin</option> // Admin cannot create other admins */}
                </select>
              </div>
              <div>
                <label
                  htmlFor="assignedStore"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Assign Store
                </label>
                <select
                  id="assignedStore"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                >
                  <option value="">-- Select a Store --</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.name}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                  {currentManager ? 'Update Manager' : 'Add Manager'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreManagerManagement;
