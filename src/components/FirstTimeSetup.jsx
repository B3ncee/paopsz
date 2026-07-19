import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addUser } from '../storageService';

function FirstTimeSetup({ onSetupComplete }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateLeader = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    const leaderUser = {
      name,
      email,
      password,
      role: 'leader',
      status: 'inactive',
    };

    // Hozzáadjuk az új felhasználót az adatbázishoz
    await addUser(leaderUser);

    // Bejelentkeztetjük az új felhasználót
    // Megjegyzés: Az ID-t a Firebase generálja, de a bejelentkezéshez most nem kell,
    // mert az App.jsx-ben a streamUsers be fogja tölteni az új usert ID-val együtt.
    const loginData = {
        email: leaderUser.email,
        name: leaderUser.name,
        role: leaderUser.role,
    };
    localStorage.setItem('user', JSON.stringify(loginData));
    onSetupComplete(loginData);
  };

  return (
    <div className="login-container">
      <h1>Rendszerbeállítás</h1>
      <p>Úgy tűnik, ez az alkalmazás első indítása.</p>
      <p>Hozd létre a Vezér fiókot a folytatáshoz.</p>

      <form onSubmit={handleCreateLeader} className="login-form">
        <h3>Vezér pozíció átvétele</h3>
        <input
          type="text"
          placeholder="Teljes név"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email cím"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Jelszó"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Fiók létrehozása és bejelentkezés</button>
      </form>
    </div>
  );
}

FirstTimeSetup.propTypes = {
  onSetupComplete: PropTypes.func.isRequired,
};

export default FirstTimeSetup;