const USERS_KEY = 'paopsz_users';
const MISSIONS_KEY = 'paopsz_missions';
const PATROL_UNITS_KEY = 'paopsz_patrol_units';
const PATROL_LOCATIONS_KEY = 'paopsz_patrol_locations';

const initialUsers = [];

const getFromStorage = (key, defaultValue) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

export const getInitialData = () => {
  const users = getFromStorage(USERS_KEY, initialUsers);
  // Biztosítjuk, hogy a felhasználóknak legyen status mezője
  const usersWithStatus = users.map(u => ({ status: 'inactive', ...u }));

  return {
    users: usersWithStatus,
    missions: getFromStorage(MISSIONS_KEY, []),
    patrolUnits: getFromStorage(PATROL_UNITS_KEY, []),
    patrolLocations: getFromStorage(PATROL_LOCATIONS_KEY, {}),
  };
};

export const saveData = (data) => {
  if (data.users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(data.users));
  }
  if (data.missions) {
    localStorage.setItem(MISSIONS_KEY, JSON.stringify(data.missions));
  }
  if (data.patrolUnits) {
    localStorage.setItem(PATROL_UNITS_KEY, JSON.stringify(data.patrolUnits));
  }
  if (data.patrolLocations) {
    localStorage.setItem(PATROL_LOCATIONS_KEY, JSON.stringify(data.patrolLocations));
  }
};