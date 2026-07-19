import { useEffect, useState } from 'react';
import { MapView } from '../components/MapView';
import { getMissions, getTeamById, getUserBySession, Mission, PatrolTeam } from '../store';
import { useAuth } from '../auth';
import { AlertButton } from '../components/AlertButton';

export function PatrolPage() {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [team, setTeam] = useState<PatrolTeam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUserBySession();
    if (!currentUser?.teamId) {
      setLoading(false);
      return;
    }

    const teamData = getTeamById(currentUser.teamId);
    if (teamData) {
      setTeam(teamData);
    }

    const allMissions = getMissions();
    setMissions(allMissions.filter((mission) => mission.assignedTeamId === currentUser.teamId));
    setLoading(false);
  }, [user?.teamId]);

  const teamMarkers = team ? [{ id: team.id, name: team.name, number: team.number, position: [team.lat, team.lng] as [number, number] }] : [];

  return (
    <main className="page-container">
      <section className="card">
        <h1>Járőrcsapat oldal</h1>
        {loading ? (
          <p>Betöltés...</p>
        ) : (
          <>
            {team ? (
              <>
                <h2>Csapat: {team.number} - {team.name}</h2>
                <p>Tagok: {team.members.length}</p>
                <div className="card secondary">
                  <h2>Csapat helye</h2>
                  <MapView markers={teamMarkers} />
                </div>
              </>
            ) : (
              <p>Nem vagy egy csapathoz rendelve.</p>
            )}

            <div className="missions">
              <h2>Küldetések</h2>
              {missions.length === 0 ? (
                <p>Nincs jelenleg küldetés.</p>
              ) : (
                missions.map((mission) => (
                  <article key={mission.id} className="mission-card">
                    <h3>{mission.title}</h3>
                    <p>{mission.description}</p>
                  </article>
                ))
              )}
            </div>
          </>
        )}
      </section>
        <AlertButton />
    </main>
  );
}
