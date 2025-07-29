// src/layouts/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/users/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-blue-900 text-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/" className="text-2xl font-bold hover:text-gray-300">
          AutoHub
        </Link>
        <nav className="space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/info/about" className="hover:text-gray-300">About</Link>
          <Link to="/listings" className="hover:text-gray-300">Оголошення</Link>
          {user && (
            <Link to="/listings/new" className="hover:text-gray-300">Додати оголошення</Link>
          )}
          {user ? (
            <>
              <Link to="/profile" className="hover:text-gray-300">Profile</Link>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link
                to="/register"
                className="ml-2 px-3 py-1 bg-green-500 rounded hover:bg-green-600 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
