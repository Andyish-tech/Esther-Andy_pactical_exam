import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Do not show the public header if we are inside the dashboard area
  if (location.pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <header className="border-b border-slate-900 bg-[#090d16]/80 backdrop-blur-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-gradient flex items-center gap-2">
          <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
          <span>CPRMS</span>
        </Link>

        {/* Action Links */}
        <div className="flex items-center gap-6">
          {token ? (
            <>
              <span className="text-sm text-slate-400">
                Logged in as <strong className="text-slate-200">{user.username || 'User'}</strong>
              </span>
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-slate-400 hover:text-white transition-all font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-bold transition-all ${
                  location.pathname === '/login' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}