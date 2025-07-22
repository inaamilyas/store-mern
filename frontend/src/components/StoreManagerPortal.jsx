import { useState,useEffect } from "react";

const StoreManagerPortal = ({ onLogout, managerData, stores, setStores, setWalkInLogs, telcoTrends }) => {
  // managerData will contain { id, name, email, password, role, storeId }
  const [store, setStore] = useState(null); // The specific store this manager oversees
  const [walkInCountInput, setWalkInCountInput] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' }); // For success/error messages

  useEffect(() => {
    if (managerData && managerData.storeId && stores) {
      // Find the store associated with this manager
      const assignedStore = stores.find(s => s.name === managerData.storeId);
      if (assignedStore) {
        setStore(assignedStore);
      } else {
        setStore(null); // Store not found
        setMessage({ type: 'error', text: 'Assigned store not found.' });
      }
    }
  }, [managerData, stores]);

  const handleAddWalkIn = () => {
    const newCount = parseInt(walkInCountInput, 10);
    if (!store) {
      setMessage({ type: 'error', text: 'No store assigned or loaded.' });
      return;
    }
    if (isNaN(newCount) || newCount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid positive number for walk-in count.' });
      return;
    }

    // Simulate updating the store's walk-in count
    setStores(prevStores => prevStores.map(s =>
      s.id === store.id
        ? { ...s, walkIns: (s.walkIns || 0) + newCount, todayWalkIns: (s.todayWalkIns || 0) + newCount }
        : s
    ));

    // Simulate adding a new walk-in log entry
    setWalkInLogs(prevLogs => [
      ...prevLogs,
      { id: generateId(), storeName: store.name, timestamp: new Date().toLocaleString(), count: newCount }
    ]);

    setMessage({ type: 'success', text: `Successfully added ${newCount} walk-ins to ${store.name}.` });
    setWalkInCountInput('');
  };

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">{message.text || 'Loading store data or no store assigned...'}</p>
      </div>
    );
  }

  // Filter telco trends relevant to this store's category
  const matchedTelcoTrends = telcoTrends.filter(
    trend => trend.category === store.category
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Store Manager Portal - {store.name}</h1>
          <button
            onClick={onLogout}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        </div>

        {message.text && (
          <div className={`p-3 rounded-lg mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Store Data Overview */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Your Store's Data</h2>
            <p className="text-gray-700"><strong>Store Name:</strong> {store.name}</p>
            <p className="text-700"><strong>Category:</strong> {store.category}</p>
            <p className="text-gray-700"><strong>Total Walk-ins:</strong> {store.walkIns || 0}</p>
            <p className="text-gray-700"><strong>Today's Walk-ins:</strong> {store.todayWalkIns || 0}</p>
          </div>

          {/* Add Walk-in Count */}
          <div className="bg-green-50 p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-green-800 mb-4">Add Walk-in Count</h2>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 mb-4"
                placeholder="Enter count"
                value={walkInCountInput}
                onChange={(e) => setWalkInCountInput(e.target.value)}
                min="1"
              />
            </div>
            <button
              onClick={handleAddWalkIn}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              Add Walk-ins
            </button>
          </div>

          {/* Matched Telco Trends */}
          <div className="md:col-span-2 bg-purple-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-purple-800 mb-4">Matched Telco Trends for Your Category</h2>
            {matchedTelcoTrends.length > 0 ? (
              <ul className="space-y-2">
                {matchedTelcoTrends.map(trend => (
                  <li key={trend.id} className="bg-purple-100 p-3 rounded-md border border-purple-200">
                    <p className="text-gray-800"><strong>Category:</strong> {trend.category}</p>
                    <p className="text-gray-700">{trend.trend}</p>
                    <p className="text-gray-500 text-sm">Date: {trend.timestamp}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No matched telco trends available for your store's category.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreManagerPortal