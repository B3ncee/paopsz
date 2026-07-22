import React, { useState } from 'react';
import { signUp, addUserProfile } from '../storageService';

function FirstTimeSetup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCreateLeader = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setError('');
    try {
      // 1. Felhasználó létrehozása az Authentication rendszerben
      const firebaseUser = await signUp(email, password);

      // 2. Felhasználói profil létrehozása a Firestore-ban
      const profileData = {
        uid: firebaseUser.uid,
        fullName: name,
        email,
        role: 'leader',
        status: 'inactive',
      };
      await addUserProfile(profileData);

      // Az App.jsx onAuthStateChanged figyelője automatikusan be fogja léptetni
    } catch (err) {
      setError(err.message);
      console.error("Hiba a vezér létrehozásakor:", err);
    }
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
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Fiók létrehozása és bejelentkezés</button>
      </form>
    </div>
  );
}

export default FirstTimeSetup;