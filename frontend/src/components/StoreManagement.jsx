import axios from 'axios';
import { useState, useEffect } from 'react';

const StoreManagement = ({ stores, setStores, isAdmin }) => {
  // Added setStores
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStore, setCurrentStore] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (currentStore) {
      setName(currentStore.name);
      setCategory(currentStore.category);
    } else {
      setName('');
      setCategory('');
    }
  }, [currentStore]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `http://localhost:5000/api/stores/${currentStore._id}`,
        {
          name: name,
          category: category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Refresh the list after update
      setStores((prevStores) =>
        prevStores.map((s) =>
          s._id === currentStore._id
            ? { ...s, ...currentStore, name, category }
            : s,
        ),
      );

      closeModal(); // optional: close the modal after saving
    } catch (err) {
      console.error(
        'Failed to update store:',
        err.response?.data || err.message,
      );
      alert('Failed to update store.');
    }
  };

  const handleAddStore = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:5000/api/stores',
        {
          name: name,
          category: category,
          floor: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const createdStore = response.data.store;
      console.log('====================================');
      console.log('createdStore', createdStore);
      console.log('====================================');

      setStores((prevStores) => [...prevStores, createdStore]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to add store:', err.response?.data || err.message);
      alert('Failed to add store.');
    }
  };

  const openModal = (store = null) => {
    setCurrentStore(store);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStore(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storeData = { name, category };
    if (currentStore) {
      setStores(
        stores.map((s) =>
          s.id === currentStore.id ? { ...s, ...storeData } : s,
        ),
      );
    } else {
      setStores([
        ...stores,
        { ...storeData, id: generateId(), walkIns: 0, todayWalkIns: 0 },
      ]); // Initialize walk-ins for new stores
    }
    closeModal(); // <--- This line was added/confirmed to fix the issue
  };

  console.log('====================================');
  console.log('stores', stores);
  console.log('====================================');

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:5000/api/stores/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted store from UI
      setStores((prevStores) => prevStores.filter((s) => s._id !== id));
    } catch (error) {
      console.error(
        'Failed to delete store:',
        error.response?.data || error.message,
      );
      alert('Failed to delete store.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-gray-700">Manage Stores</h3>
        {isAdmin && (
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Add New Store
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                Category
              </th>
              {isAdmin && (
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr
                key={store.id}
                className="border-b border-gray-200 last:border-b-0"
              >
                <td className="py-3 px-4 text-gray-800">{store.name}</td>
                <td className="py-3 px-4 text-gray-800">{store.category}</td>
                {isAdmin && (
                  <td className="py-3 px-4 flex space-x-2">
                    <button
                      onClick={() => openModal(store)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(store._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Store */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {currentStore ? 'Edit Store' : 'Add New Store'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="storeName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Store Name
                </label>
                <input
                  type="text"
                  id="storeName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="storeCategory"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <input
                  type="text"
                  id="storeCategory"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
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
                  onClick={currentStore ? handleUpdate : handleAddStore}
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                  {currentStore ? 'Update Store' : 'Add Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreManagement;
