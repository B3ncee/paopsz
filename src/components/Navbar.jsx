import React from 'react';
import PropTypes from 'prop-types';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        Polgárőr App
      </div>
      <div className="navbar-user">
        <span className="user-name">Üdv, {user.name}!</span>
        <button onClick={onLogout} className="logout-button">
          Kijelentkezés
        </button>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Navbar;