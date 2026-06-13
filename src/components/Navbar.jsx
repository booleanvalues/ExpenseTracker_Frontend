import React from 'react';
import useAuth from '../hooks/useAuth';
import { LogOut, Wallet } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="/" className="nav-logo">
          <Wallet className="nav-logo-icon" size={24} />
          <span>Expense Tracker</span>
        </a>

        {user && (
          <div className="nav-profile">
            <div className="user-badge">
              <div className="user-avatar">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <span className="user-name">{user.name}</span>
            </div>
            <button
              onClick={logout}
              className="btn btn-secondary btn-icon"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
