import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export function RegisterPage() {
  const { createUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'patrol' | 'coordinator' | 'leader'>('patrol');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createUser(email, password, role, name, phone);
      navigate('/');
    } catch (err) {
      setError('Hiba a regisztrációnál.');
    }
  }

  return (
    <main className="page-container">
      <section className="card">
        <h1>Új felhasználó</h1>
        <form onSubmit={handleSubmit}>
          <label>
            E-mail
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>
          <label>
            Jelszó
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </label>
          <label>
            Név
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Telefonszám
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </label>
          <label>
            Jogosultság
            <select value={role} onChange={(e) => setRole(e.target.value as 'patrol' | 'coordinator' | 'leader')}>
              <option value="patrol">Járőr</option>
              <option value="coordinator">Koordinátor</option>
              <option value="leader">Vezér-1</option>
            </select>
          </label>
          <button type="submit">Regisztráció</button>
          {error && <p className="error">{error}</p>}
        </form>
      </section>
    </main>
  );
}
