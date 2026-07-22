import React, { useState } from 'react';
import { createUser, deleteUser } from '../storageService';
import './UserManagement.css';

function UserManagement({ users }) {
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: 'patrol',
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const tempPassword = generatePassword();

    try {
      await createUser(
        newUser.email,
        tempPassword,
        newUser.role,
        newUser.fullName,
        newUser.phoneNumber
      );
      setGeneratedPassword(tempPassword);
      // Reset form
      setNewUser({ fullName: '', email: '', phoneNumber: '', role: 'patrol' });
      setShowAddForm(false);
    } catch (err) {
      console.error("Hiba a felhasználó létrehozásakor:", err);
      setError(`Hiba: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (window.confirm(`Biztosan törölni szeretnéd a(z) ${userEmail} felhasználót? Ez a művelet nem vonható vissza.`)) {
      try {
        await deleteUser(userId); // Csak a userId-t adjuk át
        alert('Felhasználó sikeresen törölve.');
      } catch (err) {
        console.error("Hiba a felhasználó törlésekor:", err);
        alert(`Hiba a felhasználó törlésekor: ${err.message}`);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    alert('Jelszó a vágólapra másolva!');
  };

  return (
    <div className="user-management-container">
      <h2>Felhasználók Kezelése</h2>

      {generatedPassword && (
        <div className="generated-password-info">
          <p>Felhasználó sikeresen létrehozva! Ideiglenes jelszó:</p>
          <div className="password-display">
            <code>{generatedPassword}</code>
            <button onClick={copyToClipboard} title="Másolás">📋</button>
          </div>
          <button onClick={() => setGeneratedPassword('')}>Bezár</button>
        </div>
      )}

      <button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Mégse' : 'Új felhasználó hozzáadása'}
      </button>

      {showAddForm && (
        <form onSubmit={handleCreateUser} className="add-user-form">
          <h3>Új felhasználó</h3>
          <input type="text" name="fullName" value={newUser.fullName} onChange={handleInputChange} placeholder="Teljes név" required />
          <input type="email" name="email" value={newUser.email} onChange={handleInputChange} placeholder="E-mail cím" required />
          <input type="tel" name="phoneNumber" value={newUser.phoneNumber} onChange={handleInputChange} placeholder="Telefonszám" required />
          <select name="role" value={newUser.role} onChange={handleInputChange}>
            <option value="patrol">Járőr</option>
            <option value="coordinator">Diszpécser</option>
            <option value="leader">Vezér</option>
          </select>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Létrehozás...' : 'Felhasználó létrehozása'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}

      <div className="user-list">
        <h3>Jelenlegi felhasználók</h3>
        <table>
          <thead>
            <tr>
              <th>Név</th>
              <th>Email</th>
              <th>Szerepkör</th>
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="delete-button" onClick={() => handleDeleteUser(user.id, user.email)}>
                    Törlés
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;