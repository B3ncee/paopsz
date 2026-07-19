import { useAuth } from '../auth';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="page-container">
      <section className="card">
        <h1>Üdvözöllek, {user?.name || 'polgárőr'}!</h1>
        <p>Szereped: {user?.role}</p>
        <p>Töltse be a megfelelő menüt a csapatodhoz.</p>
        <div className="button-grid">
          <button onClick={() => navigate('/profile')}>Profil</button>
          {user?.role !== 'patrol' && <button onClick={() => navigate('/coordinator')}>Koordinátor oldal</button>}
          <button onClick={() => navigate('/patrol')}>Járőrcsapat oldal</button>
        </div>
        <button className="link-button" onClick={logout}>Kijelentkezés</button>
      </section>
    </main>
  );
}
