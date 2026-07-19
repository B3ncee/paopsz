import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SidePanel.css';
import Modal from './Modal';
import { addUserProfile, deleteUserProfile } from '../storageService';

const roleNames = {
  patrol: 'Polgárőr',
  coordinator: 'Koordinátor',
  leadership: 'Vezetőség',
  leader: 'Vezér',
};

function UserManagement({ users, currentUser }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('patrol');
  const [error, setError] = useState('');

  const generatePassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length }, () => charset.charAt(Math.floor(Math.random() * charset.length))).join('');
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!name || !email || !role) return;
    setError('');

    try {
      const profileData = {
        name,
        email,
        role,
        status: 'inactive',
        mustChangePassword: true, // Jelszóváltoztatás kötelező
      };

      // Ez a metódus csak a Firestore profilt hozza létre.
      // A felhasználónak a Firebase Console-ban kell létrehozni a fiókot
      // a generált jelszóval, vagy egy "elfelejtett jelszó" emailt kell neki küldeni.
      // A kliensoldali biztonságos létrehozás bonyolultabb.
      const generatedPassword = generatePassword();
      alert(`Felhasználó létrehozva!\nEmail: ${email}\nIdeiglenes jelszó: ${generatedPassword}\n\nFONTOS: A felhasználónak a Firebase Authentication-ben is létre kell hozni ezzel a jelszóval, vagy jelszó-visszaállítást kell kérnie!`);

      await addUserProfile(profileData);
      setModalOpen(false);
      setName('');
      setEmail('');
      setRole('patrol');
    } catch (err) {
      setError(err.message);
      console.error("Hiba a felhasználó hozzáadásakor:", err);
    }
  };

  const handleDeleteUser = async (userToDelete) => {
    if (window.confirm(`Biztosan törölni szeretnéd "${userToDelete.name}" felhasználót?`)) {
      try {
        await deleteUserProfile(userToDelete.id, userToDelete.name);
      } catch (err) {
        console.error("Hiba a felhasználó törlésekor:", err);
        alert("Hiba történt a felhasználó törlése közben.");
      }
    }
  };

  return (
    <div className="side-panel-container">
      <h3>Felhasználók</h3>
      <ul className="item-list user-list">
        {users.map(user => (
          <li key={user.id} className="item user-management-item">
            <div>
              <span className="item-name">{user.name}</span>
              <span className="item-role">{roleNames[user.role] || user.role}</span>
            </div>
            {currentUser.id !== user.id && (
              <button onClick={() => handleDeleteUser(user)} className="remove-button">Törlés</button>
            )}
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
              <label>Szerepkör</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="patrol">Járőr</option>
                <option value="leadership">Vezetőség</option>
                <option value="coordinator">Koordinátor</option>
              </select>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="add-new-button">Létrehozás</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

UserManagement.propTypes = {
  users: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default UserManagement;