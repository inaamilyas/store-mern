import { useEffect, useState } from 'react';
import StoreManagement from './StoreManagement';
import StoreManagerManagement from './StoreManagerManagement';
import WalkInLogViewer from './WalkInLogViewer';
import TelcoTrendViewer from './TelcoTrendViewer';
const AdminDashboard = ({
  onLogout,
  stores,
  setStores,
  storeManagers,
  setStoreManagers,
  walkInLogs,
  telcoTrends,
  user,
}) => {
  const [activeTab, setActiveTab] = useState('storeManagers');
  const [isAdmin, setIsAdmin] = useState(user?.role === 'admin');

  useEffect(() => {
    setIsAdmin(user?.role === 'admin');
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            {isAdmin ? 'Admin' : 'Manager'} Dashboard
          </h1>
          <button
            onClick={onLogout}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        </div>

        {/* Tabs for navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {isAdmin && (
              <button
                onClick={() => setActiveTab('storeManagers')}
                className={`${
                  activeTab === 'storeManagers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition duration-300`}
              >
                Store Managers
              </button>
            )}

            <button
              onClick={() => setActiveTab('stores')}
              className={`${
                activeTab === 'stores'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition duration-300`}
            >
              Stores
            </button>
            <button
              onClick={() => setActiveTab('walkInLogs')}
              className={`${
                activeTab === 'walkInLogs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition duration-300`}
            >
              Walk-In Logs
            </button>
            <button
              onClick={() => setActiveTab('telcoTrends')}
              className={`${
                activeTab === 'telcoTrends'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition duration-300`}
            >
              Telco Trends
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'storeManagers' && (
            <StoreManagerManagement
              storeManagers={storeManagers}
              setStoreManagers={setStoreManagers} // Pass setter for updates
              stores={stores} // Pass stores to link managers to stores
            />
          )}
          {activeTab === 'stores' && (
            <StoreManagement
              stores={stores}
              setStores={setStores} // Pass setter for updates
              isAdmin={isAdmin}
            />
          )}
          {activeTab === 'walkInLogs' && (
            <WalkInLogViewer walkInLogs={walkInLogs} isAdmin={isAdmin} />
          )}
          {activeTab === 'telcoTrends' && (
            <TelcoTrendViewer telcoTrends={telcoTrends} isAdmin={isAdmin} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
