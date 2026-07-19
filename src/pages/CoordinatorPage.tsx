import { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { MapView } from '../components/MapView';
import {
  addTeamMember,
  createTeam as createTeamInStore,
  createUser as createUserInStore,
  getMissions,
  getTeams,
  getUsers,
  updateTeam,
  updateUser,
  PatrolTeam,
  StoredUser,
  Mission,
} from '../store';

export function CoordinatorPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<PatrolTeam[]>([]);
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamNumber, setNewTeamNumber] = useState('');
  const [newTeamLat, setNewTeamLat] = useState('47.4979');
  const [newTeamLng, setNewTeamLng] = useState('19.0402');
  const [selectedTeam, setSelectedTeam] = useState<PatrolTeam | null>(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<'patrol' | 'coordinator' | 'leader'>('patrol');
  const [newUserTeamId, setNewUserTeamId] = useState<string>('');

  useEffect(() => {
    setTeams(getTeams());
    setUsers(getUsers());
    setMissions(getMissions());
    setLoading(false);
  }, []);

  function refreshData() {
    setTeams(getTeams());
    setUsers(getUsers());
    setMissions(getMissions());
  }

  function createTeam() {
    if (!newTeamName || !newTeamNumber) return;
    createTeamInStore({
      name: newTeamName,
      number: newTeamNumber,
      members: [],
      lat: parseFloat(newTeamLat) || 47.4979,
      lng: parseFloat(newTeamLng) || 19.0402,
    });
    setNewTeamName('');
    setNewTeamNumber('');
    refreshData();
  }

  function saveTeam() {
    if (!selectedTeam) return;
    updateTeam(selectedTeam.id, {
      name: selectedTeam.name,
      number: selectedTeam.number,
      lat: selectedTeam.lat,
      lng: selectedTeam.lng,
    });
    setSelectedTeam(null);
    refreshData();
  }

  function onMarkerDragEnd(id: string, position: [number, number]) {
    updateTeam(id, {
      lat: position[0],
      lng: position[1],
    });
    refreshData();
    if (selectedTeam && selectedTeam.id === id) {
      setSelectedTeam({ ...selectedTeam, lat: position[0], lng: position[1] });
    }
  }

  function createUser() {
    if (!newUserEmail || !newUserPassword || !newUserName) return;
    createUserInStore({
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole,
      name: newUserName,
      phone: newUserPhone,
      teamId: newUserTeamId || undefined,
    });
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserName('');
    setNewUserPhone('');
    setNewUserRole('patrol');
    setNewUserTeamId('');
    refreshData();
  }

  function selectTeam(team: PatrolTeam) {
    setSelectedTeam(team);
  }

  function assignMemberToTeam(userId: string, teamId: string) {
    updateUser(userId, { teamId });
    addTeamMember(teamId, userId);
    refreshData();
  }

  const teamMarkers = teams.map((team) => ({ id: team.id, name: team.name, number: team.number, position: [team.lat, team.lng] as [number, number] }));

  return (
    <main className="page-container">
      <section className="card">
        <h1>Koordinátor felület</h1>
        <p>Járőrcsapatok és felhasználók kezelése</p>

        <div className="card secondary">
          <h2>Új járőrcsapat</h2>
          <label>
            Csapat neve
            <input value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} />
          </label>
          <label>
            Csapat száma
            <input value={newTeamNumber} onChange={(e) => setNewTeamNumber(e.target.value)} />
          </label>
          <label>
            Kezdeti szélesség
            <input value={newTeamLat} onChange={(e) => setNewTeamLat(e.target.value)} />
          </label>
          <label>
            Kezdeti hosszúság
            <input value={newTeamLng} onChange={(e) => setNewTeamLng(e.target.value)} />
          </label>
          <button onClick={createTeam}>Csapat létrehozása</button>
        </div>

        <div className="card secondary">
          <h2>Új felhasználó</h2>
          <label>
            E-mail
            <input value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
          </label>
          <label>
            Jelszó
            <input type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} />
          </label>
          <label>
            Név
            <input value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
          </label>
          <label>
            Telefonszám
            <input value={newUserPhone} onChange={(e) => setNewUserPhone(e.target.value)} />
          </label>
          <label>
            Jogosultság
            <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as 'patrol' | 'coordinator' | 'leader')}>
              <option value="patrol">Járőr</option>
              <option value="coordinator">Koordinátor</option>
              <option value="leader">Vezér-1</option>
            </select>
          </label>
          <label>
            Csapathoz rendelve
            <select value={newUserTeamId} onChange={(e) => setNewUserTeamId(e.target.value)}>
              <option value="">-- nincs csapat --</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.number} - {team.name}
                </option>
              ))}
            </select>
          </label>
          <button onClick={createUser}>Felhasználó létrehozása</button>
        </div>

        {loading ? (
          <p>Betöltés...</p>
        ) : (
          <>
            <div className="teams-list">
              {teams.map((team) => (
                <button key={team.id} className="team-item" onClick={() => selectTeam(team)}>
                  {team.number} - {team.name}
                </button>
              ))}
            </div>

            {selectedTeam ? (
              <div className="card secondary">
                <h2>Csapat szerkesztése</h2>
                <label>
                  Név
                  <input value={selectedTeam.name} onChange={(e) => setSelectedTeam({ ...selectedTeam, name: e.target.value })} />
                </label>
                <label>
                  Szám
                  <input value={selectedTeam.number} onChange={(e) => setSelectedTeam({ ...selectedTeam, number: e.target.value })} />
                </label>
                <label>
                  Szélesség
                  <input value={selectedTeam.lat} onChange={(e) => setSelectedTeam({ ...selectedTeam, lat: parseFloat(e.target.value) || 0 })} />
                </label>
                <label>
                  Hosszúság
                  <input value={selectedTeam.lng} onChange={(e) => setSelectedTeam({ ...selectedTeam, lng: parseFloat(e.target.value) || 0 })} />
                </label>
                <button onClick={saveTeam}>Mentés</button>
              </div>
            ) : null}

            <div className="card secondary">
              <h2>Járőrcsapatok térképen</h2>
              {teams.length > 0 ? <MapView markers={teamMarkers} onMarkerDragEnd={onMarkerDragEnd} /> : <p>Nincs elérhető csapat a térképhez.</p>}
            </div>

            <div className="card secondary">
              <h2>Felhasználók</h2>
              <div className="teams-list">
                {users.map((member) => (
                  <div key={member.uid} className="team-item">
                    <strong>{member.name}</strong> ({member.role}) {member.teamId ? `- csapat: ${member.teamId}` : '- nincs csapat'}
                    {member.role === 'patrol' && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <select
                          value={member.teamId || ''}
                          onChange={(e) => assignMemberToTeam(member.uid, e.target.value)}
                        >
                          <option value="">-- válassz csapatot --</option>
                          {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.number} - {team.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
