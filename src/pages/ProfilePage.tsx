import { FormEvent, useState } from 'react';
import { useAuth } from '../auth';

export function ProfilePage() {
  const { user, saveProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await saveProfile({ name, phone });
    setMessage('Mentve');
  }

  return (
    <main className="page-container">
      <section className="card">
        <h1>Profil</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Név
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Telefonszám
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <button type="submit">Mentés</button>
          {message && <p>{message}</p>}
        </form>
      </section>
    </main>
  );
}
