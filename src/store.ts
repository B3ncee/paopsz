export type Role = 'patrol' | 'coordinator' | 'leader';

export interface StoredUser {
  uid: string;
  email: string;
  password: string;
  role: Role;
  name: string;
  phone: string;
  teamId?: string;
}

export interface UserData {
  uid: string;
  email: string;
  role: Role;
  name: string;
  phone: string;
  teamId?: string;
}

export interface PatrolTeam {
  id: string;
  name: string;
  number: string;
  members: string[];
  lat: number;
  lng: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  assignedTeamId: string;
  createdAt: number;
}

const STORAGE_KEYS = {
  users: 'polgaror_users',
  session: 'polgaror_session',
  teams: 'polgaror_teams',
  missions: 'polgaror_missions',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function generateId() {
  return Math.random().toString(36).slice(2, 12);
}

export function getUsers(): StoredUser[] {
  return loadFromStorage<StoredUser[]>(STORAGE_KEYS.users, []);
}

export function saveUsers(users: StoredUser[]) {
  saveToStorage(STORAGE_KEYS.users, users);
}

export function getTeams(): PatrolTeam[] {
  return loadFromStorage<PatrolTeam[]>(STORAGE_KEYS.teams, []);
}

export function saveTeams(teams: PatrolTeam[]) {
  saveToStorage(STORAGE_KEYS.teams, teams);
}

export function getMissions(): Mission[] {
  return loadFromStorage<Mission[]>(STORAGE_KEYS.missions, []);
}

export function saveMissions(missions: Mission[]) {
  saveToStorage(STORAGE_KEYS.missions, missions);
}

export function getSessionUserId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.session);
}

export function setSessionUserId(uid: string | null) {
  if (uid) {
    localStorage.setItem(STORAGE_KEYS.session, uid);
  } else {
    localStorage.removeItem(STORAGE_KEYS.session);
  }
}

export function seedDefaultData() {
  const users = getUsers();
  const teams = getTeams();
  const missions = getMissions();

  if (users.length === 0) {
    saveUsers([
      {
        uid: 'leader-1',
        email: 'leader@polgaror.hu',
        password: 'leader123',
        role: 'leader',
        name: 'Vezér-1',
        phone: '+3610000000',
      },
      {
        uid: 'coord-1',
        email: 'koord@polgaror.hu',
        password: 'koord123',
        role: 'coordinator',
        name: 'Koordinátor',
        phone: '+3611111111',
      },
      {
        uid: 'patrol-1',
        email: 'patrol@polgaror.hu',
        password: 'patrol123',
        role: 'patrol',
        name: 'Járőr Pista',
        phone: '+3612222222',
        teamId: 'team-1',
      },
    ]);
  }

  if (teams.length === 0) {
    saveTeams([
      {
        id: 'team-1',
        name: 'Budapest I.',
        number: '001',
        members: ['patrol-1'],
        lat: 47.4979,
        lng: 19.0402,
      },
    ]);
  }

  if (missions.length === 0) {
    saveMissions([
      {
        id: 'mission-1',
        title: 'Piac körbejárása',
        description: 'Ellenőrizd a piac környékét és jelentsd a helyzetet.',
        assignedTeamId: 'team-1',
        createdAt: Date.now(),
      },
    ]);
  }
}

export function getUserById(uid: string): StoredUser | undefined {
  return getUsers().find((user) => user.uid === uid);
}

export function getUserBySession(): StoredUser | null {
  const uid = getSessionUserId();
  if (!uid) return null;
  return getUserById(uid) ?? null;
}

export function createUser(user: Omit<StoredUser, 'uid'>) {
  const users = getUsers();
  const newUser = { ...user, uid: generateId() };
  saveUsers([...users, newUser]);
  return newUser;
}

export function updateUser(uid: string, patch: Partial<Omit<StoredUser, 'uid' | 'email' | 'role'>>) {
  const users = getUsers();
  const updated = users.map((user) =>
    user.uid === uid
      ? {
          ...user,
          ...patch,
        }
      : user,
  );
  saveUsers(updated);
}

export function createTeam(team: Omit<PatrolTeam, 'id'>) {
  const teams = getTeams();
  const newTeam = { ...team, id: generateId() };
  saveTeams([...teams, newTeam]);
  return newTeam;
}

export function updateTeam(id: string, patch: Partial<Omit<PatrolTeam, 'id' | 'members'>>) {
  const teams = getTeams();
  const updated = teams.map((team) => (team.id === id ? { ...team, ...patch } : team));
  saveTeams(updated);
}

export function addTeamMember(teamId: string, userId: string) {
  const teams = getTeams();
  const updatedTeams = teams.map((team) =>
    team.id === teamId && !team.members.includes(userId)
      ? { ...team, members: [...team.members, userId] }
      : team,
  );
  saveTeams(updatedTeams);
}

export function getTeamById(id: string): PatrolTeam | undefined {
  return getTeams().find((team) => team.id === id);
}
