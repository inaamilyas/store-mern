import axios from 'axios';
import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/login',
        {
          email: username,
          password: password,
        },
      );

      console.log('====================================');
      console.log('response', response);
      console.log('====================================');

      const { token } = response.data;

      // ✅ Decode token to get user info
      const decoded = jwtDecode(token);
      console.log('decoded', decoded, decoded.userId, decoded.role);

      const user = decoded;

      console.log('====================================');
      console.log(user);
      console.log('====================================');

      // Optional: Store token for future API calls
      localStorage.setItem('token', token);
      localStorage.setItem(
        'user',
        JSON.stringify({ id: decoded.userId, role: decoded.role }),
      );
      setUser(user);

      // if (role === 'admin') {
      //   onLogin('admin', { userId }, token); // Admin doesn't have a store
      // } else if (role === 'manager') {
      //   onLogin('storeManager', { userId }, token);
      // } else {
      //   setError('Invalid role.');
      // }
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login to SmartMall Portal
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username (Email)
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
