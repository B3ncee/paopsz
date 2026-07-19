import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SidePanel.css';
import Modal from './Modal';

const roleNames = {
  patrol: 'Polgárőr',
  coordinator: 'Koordinátor',
  leadership: 'Vezetőség',
  leader: 'Vezér',
};

function UserManagement({ users, setUsers }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patrol');

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) return;

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role,
      status: 'inactive',
    };

    setUsers([...users, newUser]);
    setModalOpen(false);
    setName('');
    setEmail('');
    setPassword('');
    setRole('patrol');
  };

  return (
    <div className="side-panel-container">
      <h3>Felhasználók</h3>
      <ul className="item-list user-list">
        {users.map(user => (
          <li key={user.id} className="item">
            <span className="item-name">{user.name}</span>
            <span className="item-role">{roleNames[user.role] || user.role}</span>
          </li>
        ))}
      </ul>
      <button className="add-new-button" onClick={() => setModalOpen(true)}>
        Új felhasználó
      </button>

      {isModalOpen && (
        <Modal title="Új felhasználó létrehozása" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleAddUser} className="modal-form">
            <div className="form-group">
              <label>Név</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Jelszó</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Szerepkör</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="patrol">Járőr</option>
                <option value="leadership">Vezetőség</option>
                <option value="coordinator">Koordinátor</option>
              </select>
            </div>
            <button type="submit" className="add-new-button">Létrehozás</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

UserManagement.propTypes = {
  users: PropTypes.array.isRequired,
  setUsers: PropTypes.func.isRequired,
};

export default UserManagement;