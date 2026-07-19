import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PatrolView from './components/PatrolView';
import FirstTimeSetup from './components/FirstTimeSetup';
import { streamUsers, streamMissions, streamPatrolUnits, streamPatrolLocations, logOut } from './storageService.js';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.js';

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [missions, setMissions] = useState([]);
  const [patrolUnits, setPatrolUnits] = useState([]);
  const [patrolLocations, setPatrolLocations] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Új állapot a betöltés jelzésére

  // Adatok betöltése induláskor
  useEffect(() => {
    // Feliratkozás a valós idejű adatfolyamokra
    const unsubUsers = streamUsers((data) => {
      setUsers(data);
      setIsLoading(false); // Akkor fejezzük be a töltést, ha a felhasználók megérkeztek
    });
    const unsubMissions = streamMissions(setMissions);
    const unsubPatrolUnits = streamPatrolUnits(setPatrolUnits);
    const unsubPatrolLocations = streamPatrolLocations(setPatrolLocations);

    // Leiratkozás, amikor a komponens megszűnik
    return () => {
      unsubUsers();
      unsubMissions();
      unsubPatrolUnits();
      unsubPatrolLocations();
    };
  }, []);

  // Figyeljük a bejelentkezési állapot változását
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Ha van bejelentkezett user, de a profilja még nincs betöltve, megvárjuk
        const userProfile = users.find(u => u.uid === firebaseUser.uid);
        if (userProfile) {
          setUser(userProfile);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logOut();
    // A onAuthStateChanged automatikusan null-ra állítja a usert
  };

  if (isLoading) {
    return <div>Adatok betöltése...</div>; // Várakozás, amíg az adatok betöltődnek
  }

  // Ha nincs még felhasználó, az első beállítást mutatjuk
  if (users.length === 0) {
    return (
      <FirstTimeSetup />
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
          missions={missions}
          patrolUnits={patrolUnits}
          patrolLocations={patrolLocations}
        />
      ) : (
        <PatrolView
          user={user}
          missions={missions.filter(m => m.assignedTo === user.id)}
        />
      )}
    </div>
  );
}

export default App;