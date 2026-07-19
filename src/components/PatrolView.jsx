import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './PatrolView.css';

function PatrolView({ user, users, setUsers, missions, setPatrolLocations }) {
  const currentUser = users.find(u => u.id === user.id);
  const isOnDuty = currentUser?.status === 'active';
  const locationWatcher = useRef(null);

  const toggleDuty = () => {
    setUsers(currentUsers =>
      currentUsers.map(u =>
        u.id === user.id
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u
      )
    );
  };

  useEffect(() => {
    if (isOnDuty) {
      // Start watching location
      locationWatcher.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = {
            id: user.id,
            name: user.name,
            location: { lat: latitude, lng: longitude },
            timestamp: Date.now(),
          };
          setPatrolLocations(prev => ({ ...prev, [user.id]: newLocation }));
        },
        (error) => {
          console.error("Hiba a pozíció lekérésekor:", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      // Stop watching location
      if (locationWatcher.current) {
        navigator.geolocation.clearWatch(locationWatcher.current);
        locationWatcher.current = null;
      }
      // Remove location from map
      setPatrolLocations(prev => {
        const newState = { ...prev };
        delete newState[user.id];
        return newState;
      });
    }

    return () => {
      // Cleanup on component unmount
      if (locationWatcher.current) {
        navigator.geolocation.clearWatch(locationWatcher.current);
      }
    };
  }, [isOnDuty, user.id, user.name, setPatrolLocations]);

  return (
    <div className="patrol-view-container">
      <div className="patrol-header">
        <h2>Járőr felület</h2>
        <button onClick={toggleDuty} className={`duty-button ${isOnDuty ? 'on-duty' : 'off-duty'}`}>
          {isOnDuty ? 'Szolgálat befejezése' : 'Szolgálatba lépek'}
        </button>
      </div>
      <div className="patrol-missions">
        <h3>Rám kiosztott küldetések</h3>
        {missions.length > 0 ? (
          <ul>{missions.map(m => <li key={m.id}>{m.title}</li>)}</ul>
        ) : (
          <p>Nincs rád kiosztott küldetés.</p>
        )}
      </div>
    </div>
  );
}

PatrolView.propTypes = {
  user: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  setUsers: PropTypes.func.isRequired,
  missions: PropTypes.array.isRequired,
  setPatrolLocations: PropTypes.func.isRequired,
};

export default PatrolView;