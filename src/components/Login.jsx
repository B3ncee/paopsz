import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Login({ onLoginSuccess, allUsers }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = allUsers.find(u => u.email === email);

    if (user && user.password === password) {
      setError('');
      const userData = { id: user.id, email: user.email, name: user.name, role: user.role };
      // Sikeres bejelentkezés, adatokat mentjük a localStorage-ba
      localStorage.setItem('user', JSON.stringify(userData));
      onLoginSuccess(userData);
    } else {
      setError('Hibás email cím vagy jelszó!');
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