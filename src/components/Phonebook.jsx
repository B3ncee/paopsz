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

  // 1. Csoportosítjuk a felhasználókat szerepkör szerint
  const groupedUsers = users.reduce((acc, user) => {
    const role = user.role || 'patrol'; // Ha nincs szerepkör, legyen járőr
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(user);
    return acc;
  }, {});

  // 2. Meghatározzuk a csoportok sorrendjét
  const roleOrder = ['leader', 'coordinator', 'patrol'];

  return (
    <Modal title="Telefonkönyv" onClose={onClose}>
      <div className="phonebook-container">
        {roleOrder.map(role => (
          groupedUsers[role] && (
            <div key={role} className="phonebook-group">
              <h3 className="phonebook-group-title">{roleNames[role]}</h3>
              <ul className="phonebook-list">
                {groupedUsers[role]
                  .sort((a, b) => a.fullName.localeCompare(b.fullName)) // Név szerinti rendezés a csoporton belül
                  .map(user => (
                    <li key={user.id} className="phonebook-item">
                      <div className="user-info">
                        <span className="user-name">{user.fullName}</span>
                      </div>
                      <div className="user-contact">
                        <a href={`tel:${user.phoneNumber}`}>{user.phoneNumber}</a>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )
        ))}
      </div>
    </Modal>
  );
}

Phonebook.propTypes = {
  users: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Phonebook;