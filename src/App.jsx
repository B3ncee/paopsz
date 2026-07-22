import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.js';
import { streamUsers, streamMissions, streamPatrolUnits, streamPatrolLocations, streamLogs, logOut } from './storageService.js';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PatrolView from './components/PatrolView';
import FirstTimeSetup from './components/FirstTimeSetup';
import ForcePasswordChange from './components/ForcePasswordChange';

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [missions, setMissions] = useState([]);
  const [patrolUnits, setPatrolUnits] = useState([]);
  const [patrolLocations, setPatrolLocations] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // 1. Adatfolyamok feliratkozása
  useEffect(() => {
    let isMounted = true;

    const unsubUsers = streamUsers((data) => {
      if (isMounted) {
        setUsers(data);
        // A betöltést csak akkor állítjuk le, ha a felhasználók és a bejelentkezési állapot is megvan.
        // A bejelentkezés figyelője fogja ezt kezelni.
      }
    });
    const unsubMissions = streamMissions(setMissions);
    const unsubPatrolUnits = streamPatrolUnits(setPatrolUnits);
    const unsubPatrolLocations = streamPatrolLocations(setPatrolLocations);
    const unsubLogs = streamLogs(setLogs);

    // Leiratkozás, amikor a komponens megszűnik
    return () => {
      isMounted = false;
      unsubUsers();
      unsubMissions();
      unsubPatrolUnits();
      unsubPatrolLocations();
      unsubLogs();
    };
  }, []);

  // 2. Bejelentkezési állapot figyelése és felhasználói profil összekapcsolása
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Várjuk meg, amíg a 'users' tömb betöltődik
        if (users.length > 0) {
          const userProfile = users.find(u => u.uid === firebaseUser.uid);
          setUser(userProfile || null); // Ha nincs profil, null-ra állítjuk
          setIsLoading(false); // Itt jelezzük, hogy a betöltés kész
        }
        // Ha a users még üres, a következő render-nél (amikor a users megérkezik) újra lefut
      } else {
        setUser(null);
        setIsLoading(false); // Nincs user, a betöltés kész
      }
    });
    return () => unsubscribe();
  }, [users]); // Újra lefut, ha a 'users' tömb megváltozik

  const handleLogout = async () => {
    await logOut();
    // Az onAuthStateChanged kezeli a user state-et
  };

  // Tartalom renderelése a felhasználó állapota és szerepköre alapján
  const renderContent = () => {
    if (isLoading) {
      return <div>Adatok betöltése...</div>;
    }

    // Ha nincs egyetlen felhasználó sem a rendszerben, első beállítás szükséges
    if (users.length === 0) {
      return <FirstTimeSetup />;
    }

    // Ha nincs bejelentkezett felhasználó, a Login képernyő jön
    if (!user) {
      return <Login onLoginSuccess={setUser} allUsers={users} />;
    }

    // Ha a felhasználónak kötelező jelszót változtatnia
    if (user.mustChangePassword) {
      return <ForcePasswordChange user={user} />;
    }

    // Szerepkör alapú jogosultságok definiálása
    const canDispatch = ['leader', 'coordinator'].includes(user.role);
    const canManageUsers = user.role === 'leader';

    // A járőrök csak a saját küldetéseiket látják
    if (!canDispatch) {
      return (
        <PatrolView
          user={user}
          missions={missions.filter(m => m.assignedTo === user.id)}
          // A telefonkönyv funkciót ide kell majd bekötni
        />
      );
    }

    // A diszpécserek és vezetők a Dashboard-ot látják
    return (
      <Dashboard
        user={user}
        users={users}
        missions={missions}
        logs={logs}
        patrolUnits={patrolUnits}
        patrolLocations={patrolLocations}
        canManageUsers={canManageUsers}
        // A szolgálatba állás és telefonkönyv funkciót ide is be kell majd kötni
      />
    );
  };

  return (
    <div className="app-container">
      {user && <Navbar user={user} users={users} onLogout={handleLogout} />}
      {renderContent()}
    </div>
  );
}

export default App;