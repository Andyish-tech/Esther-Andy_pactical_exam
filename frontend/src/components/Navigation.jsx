import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    setMenuOpen(false);
  };

  // Do not show the public header if we are inside the dashboard area
  if (location.pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <header className="border-b border-black bg-white sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-extrabold tracking-tight text-black flex items-center gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-black shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
          <span>CPRMS</span>
        </Link>

        {/* Desktop Action Links */}
        <div className="hidden sm:flex items-center gap-6">
          {token ? (
            <>
              <span className="text-sm text-gray-500">
                Logged in as <strong className="text-black">{user.username || 'User'}</strong>
              </span>
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-bold rounded-lg bg-black hover:bg-[#a1a1aa] text-white transition-all duration-200"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-[#a1a1aa] transition-all duration-200 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-bold transition-all duration-200 ${
                  location.pathname === '/login' ? 'text-black' : 'text-gray-500 hover:text-[#a1a1aa]'
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-bold rounded-lg bg-white hover:bg-gray-100 text-black border border-black hover:border-[#a1a1aa] transition-all duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="sm:hidden p-2 rounded-lg border border-black text-black hover:border-[#a1a1aa] hover:text-[#a1a1aa] transition-all duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-black bg-white px-4 py-4 space-y-3">
          {token ? (
            <>
              <p className="text-sm text-gray-500 py-2 border-b border-gray-100">
                Logged in as <strong className="text-black">{user.username || 'User'}</strong>
              </p>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 text-sm font-bold rounded-lg bg-black hover:bg-[#a1a1aa] text-white transition-all duration-200"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-center text-sm text-gray-500 hover:text-[#a1a1aa] transition-all duration-200 font-medium py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={`block w-full text-center py-2.5 text-sm font-bold transition-all duration-200 ${
                  location.pathname === '/login' ? 'text-black' : 'text-gray-500 hover:text-[#a1a1aa]'
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 text-sm font-bold rounded-lg bg-white hover:bg-gray-100 text-black border border-black hover:border-[#a1a1aa] transition-all duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}