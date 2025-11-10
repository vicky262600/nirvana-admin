import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../slices/authSlice';
import { apiFetch } from '../utils/apiClient';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFetching, currentUser } = useSelector(state => state.auth);

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    dispatch(loginStart());
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const message = errBody?.message || 'Login failed';
        throw new Error(message);
      }

      const data = await res.json();
      const user = data.user;

      if (!user || !user.isAdmin) {
        dispatch(loginFailure('You are not allowed'));
        setError('You are not allowed');
        return;
      }

      dispatch(loginSuccess(user));
    } catch (err) {
      const message =
        err.message === 'Invalid credentials'
          ? 'Wrong credentials'
          : err.message || 'Login failed';
      dispatch(loginFailure(message));
      setError(message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-md"
      >
        <h1 className="text-3xl font-semibold mb-6 text-center">Admin Login</h1>

        <label className="block mb-4">
          <span className="block mb-1 font-medium">Email</span>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="admin@example.com"
          />
        </label>

        <label className="block mb-4">
          <span className="block mb-1 font-medium">Password</span>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </label>

        {error && (
          <p className="mb-4 text-red-600 text-center font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={isFetching}
          className="w-full bg-black text-white py-3 px-4 rounded hover:bg-gray-900 transition"
        >
          {isFetching ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </main>
  );
};

export default Login;
