import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { forceUpdatePassword } from '../storageService';

function ForcePasswordChange({ user }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('A két jelszó nem egyezik!');
      return;
    }
    if (newPassword.length < 6) {
      setError('A jelszónak legalább 6 karakter hosszúnak kell lennie.');
      return;
    }
    setError('');
    try {
      await forceUpdatePassword(newPassword);
      // A sikeres változtatás után az App komponens automatikusan be fogja léptetni.
      // Itt elég egy oldalfrissítés, hogy az App újra lefusson.
      window.location.reload();
    } catch (err) {
      setError('Hiba a jelszóváltoztatás során: ' + err.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Jelszó Megváltoztatása</h1>
      <p>Biztonsági okokból az első bejelentkezéskor meg kell változtatnod a jelszavadat.</p>
      <form onSubmit={handleChangePassword} className="login-form">
        <input
          type="password"
          placeholder="Új jelszó"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Új jelszó megerősítése"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Jelszó megváltoztatása</button>
      </form>
    </div>
  );
}

ForcePasswordChange.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ForcePasswordChange;