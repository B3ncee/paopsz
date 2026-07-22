import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import './Phonebook.css';

function Phonebook({ users, onClose }) {
  // Szerepkörök magyar nevei
  const roleNames = {
    leader: 'Vezér',
    coordinator: 'Diszpécser',
    patrol: 'Járőr',
  };

  return (
    <Modal title="Telefonkönyv" onClose={onClose}>
      <div className="phonebook-container">
        <ul className="phonebook-list">
          {users
            .sort((a, b) => a.fullName.localeCompare(b.fullName)) // Rendezés név szerint
            .map(user => (
              <li key={user.id} className="phonebook-item">
                <div className="user-info">
                  <span className="user-name">{user.fullName}</span>
                  <span className="user-role">{roleNames[user.role] || user.role}</span>
                </div>
                <div className="user-contact">
                  <a href={`tel:${user.phoneNumber}`}>{user.phoneNumber}</a>
                </div>
              </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}

Phonebook.propTypes = {
  users: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Phonebook;