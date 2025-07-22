import { useEffect, useState } from 'react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import axios from 'axios';
const App = () => {
  const generateId = () => Math.random().toString(36).substr(2, 9);
  const [error, setError] = useState('');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  // Centralized simulated data
  const [stores, setStores] = useState([
    {
      id: generateId(),
      name: 'SmartMart',
      category: 'General',
      walkIns: 1250,
      todayWalkIns: 150,
    },
    {
      id: generateId(),
      name: 'FashionHub',
      category: 'Apparel',
      walkIns: 850,
      todayWalkIns: 80,
    },
    {
      id: generateId(),
      name: 'GadgetZone',
      category: 'Electronics',
      walkIns: 600,
      todayWalkIns: 50,
    },
  ]);
  const [storeManagers, setStoreManagers] = useState([
    {
      id: 'sm1',
      name: 'Alice Smith',
      email: 'alice@example.com',
      password: 'managerpass',
      role: 'storeManager',
      storeId: 'SmartMart',
    },
    {
      id: 'sm2',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      password: 'managerpass',
      role: 'storeManager',
      storeId: 'FashionHub',
    },
    {
      id: 'sm3',
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      password: 'managerpass',
      role: 'storeManager',
      storeId: 'GadgetZone',
    },
  ]);
  const [walkInLogs, setWalkInLogs] = useState([
    {
      id: generateId(),
      storeName: 'SmartMart',
      timestamp: '2025-07-21 10:00',
      count: 150,
    },
    {
      id: generateId(),
      storeName: 'FashionHub',
      timestamp: '2025-07-21 10:15',
      count: 80,
    },
  ]);
  const [telcoTrends, setTelcoTrends] = useState([
    {
      id: generateId(),
      category: 'Apparel',
      trend: 'High interest in summer wear',
      timestamp: '2025-07-20',
    },
    {
      id: generateId(),
      category: 'Electronics',
      trend: 'Demand for new smartphone models',
      timestamp: '2025-07-20',
    },
    {
      id: generateId(),
      category: 'General',
      trend: 'Increased foot traffic on weekends',
      timestamp: '2025-07-20',
    },
    {
      id: generateId(),
      category: 'General',
      trend: 'Interest in home goods promotions',
      timestamp: '2025-07-19',
    },
  ]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log('User found in localStorage:', user);
    }
  }, []);

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('managers', response);

      setStoreManagers(response.data || []);
    } catch (err) {
      console.error(
        'Failed to fetch managers:',
        err.response?.data || err.message,
      );
      setError('Failed to load managers.');
    }
  };

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:5000/api/stores', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('response', response);

      setStores(response.data || []);
    } catch (err) {
      console.error(
        'Failed to fetch stores:',
        err.response?.data || err.message,
      );
      setError('Failed to load stores.');
    }
  };

  const fetchWalkinLogs = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(
        'http://localhost:5000/api/walkin-logs',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('setWalkInLogs', response);

      setWalkInLogs(response.data || []);
    } catch (err) {
      console.error(
        'Failed to fetch stores:',
        err.response?.data || err.message,
      );
      setError('Failed to load stores.');
    }
  };

  useEffect(() => {
    fetchStores();
    fetchManagers();
    fetchWalkinLogs();
  }, []);

  return (
    <div className="font-sans antialiased">
      {!user.role && <Login setUser={setUser} />}
      {user.role === 'ADMIN' && (
        <AdminDashboard
          onLogout={handleLogout}
          stores={stores}
          setStores={setStores}
          storeManagers={storeManagers}
          setStoreManagers={setStoreManagers}
          walkInLogs={walkInLogs}
          setWalkInLogs={setWalkInLogs}
          telcoTrends={telcoTrends}
          setTelcoTrends={setTelcoTrends}
          user={user}
        />
      )}
      {/* {user.role === 'manager' && (
        <StoreManagerPortal
          onLogout={handleLogout}
          managerData={loggedInManager} // Pass the logged-in manager's data
          stores={stores}
          setStores={setStores} // Allow StoreManager to update store walk-ins
          setWalkInLogs={setWalkInLogs} // Allow StoreManager to add to logs
          telcoTrends={telcoTrends}
        />
      )} */}
    </div>
  );
};

export default App;
