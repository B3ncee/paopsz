import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Phonebook from './Phonebook';
import './Navbar.css';

function Navbar({ user, users, onLogout }) {
  const [isPhonebookOpen, setPhonebookOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          Polgárőr App
        </div>
        {user && (
          <div className="navbar-user">
            <span className="user-name">Üdv, {user.fullName}!</span>
            <button onClick={() => setPhonebookOpen(true)} className="navbar-button">
              Telefonkönyv
            </button>
            <button onClick={onLogout} className="logout-button">
              Kijelentkezés
            </button>
          </div>
        )}
      </nav>
      {isPhonebookOpen && <Phonebook users={users} onClose={() => setPhonebookOpen(false)} />}
    </>
  );
}

Navbar.propTypes = {
  user: PropTypes.object,
  users: PropTypes.array.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Navbar;