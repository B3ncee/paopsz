import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { logIn } from '../storageService';

function Login({ onLoginSuccess, allUsers }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userProfile = await logIn(email, password);
      setError('');
      onLoginSuccess(userProfile);
    } catch (err) {
      setError('Hibás email cím vagy jelszó.');
      console.error("Bejelentkezési hiba:", err);
    }
  };

  return (
    <div className="login-container">
      <h1>Polgárőr App</h1>
      <form onSubmit={handleLogin} className="login-form">
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
        <button type="submit">Bejelentkezés</button>
      </form>
    </div>
  );
}

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
  allUsers: PropTypes.array.isRequired,
};

export default Login;