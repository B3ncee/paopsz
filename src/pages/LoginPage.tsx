import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Hiba a bejelentkezésnél.');
    }
  }

  return (
    <main className="page-container">
      <section className="card">
        <h1>Bejelentkezés</h1>
        <form onSubmit={handleSubmit}>
          <label>
            E-mail
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>
          <label>
            Jelszó
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </label>
          <button type="submit">Bejelentkezés</button>
          {error && <p className="error">{error}</p>}
        </form>
        <p className="secondary-text">
          Nincs fiókod? <Link to="/register">Regisztrálj itt</Link>.
        </p>
      </section>
    </main>
  );
}
