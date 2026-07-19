import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PatrolView from './components/PatrolView';
import FirstTimeSetup from './components/FirstTimeSetup';
import { getInitialData, saveData } from './storageService.js';

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [missions, setMissions] = useState([]);
  const [patrolUnits, setPatrolUnits] = useState([]);
  const [patrolLocations, setPatrolLocations] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Új állapot a betöltés jelzésére

  // Adatok betöltése induláskor
  useEffect(() => {
    const data = getInitialData();
    setUsers(data.users);
    setMissions(data.missions);
    setPatrolUnits(data.patrolUnits);
    setPatrolLocations(data.patrolLocations);
    setIsLoading(false); // Betöltés befejezve

    // Figyeljük a localStorage változásait (böngészőfülek közötti kommunikáció)
    const handleStorageChange = () => {
      const updatedData = getInitialData();
      setUsers(updatedData.users);
      setMissions(updatedData.missions);
      setPatrolUnits(updatedData.patrolUnits);
      setPatrolLocations(updatedData.patrolLocations);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Adatok mentése, ha változnak
  useEffect(() => {
    saveData({ users, missions, patrolUnits, patrolLocations });
  }, [users, missions, patrolUnits, patrolLocations]);

  useEffect(() => {
    // Ellenőrizzük, hogy van-e bejelentkezett felhasználó a localStorage-ban
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (isLoading) {
    return <div>Adatok betöltése...</div>; // Várakozás, amíg az adatok betöltődnek
  }

  // Ha nincs még felhasználó, az első beállítást mutatjuk
  if (users.length === 0) {
    return (
      <FirstTimeSetup
        setUsers={setUsers}
        onSetupComplete={setUser}
      />
    );
  }

  if (!user) {
    return <Login onLoginSuccess={setUser} allUsers={users} />;
  }

  // A szerepkör alapján döntjük el, mit mutatunk
  const isDispatcher = ['leader', 'coordinator', 'leadership'].includes(user.role);

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={handleLogout} />
      {isDispatcher ? (
        <Dashboard
          user={user}
          users={users}
          setUsers={setUsers}
          missions={missions}
          setMissions={setMissions}
          patrolUnits={patrolUnits}
          setPatrolUnits={setPatrolUnits}
          patrolLocations={patrolLocations}
        />
      ) : (
        <PatrolView
          user={user}
          users={users}
          setUsers={setUsers}
          missions={missions.filter(m => m.assignedTo === user.id)}
          setPatrolLocations={setPatrolLocations}
        />
      )}
    </div>
  );
}

export default App;