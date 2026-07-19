import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './PatrolView.css';
import { updateUserStatus, updatePatrolLocation } from '../storageService';

function PatrolView({ user, missions }) {
  const [isOnDuty, setIsOnDuty] = useState(false);
  const locationWatcher = useRef(null);

  const toggleDuty = async () => {
    const newStatus = !isOnDuty;
    await updateUserStatus(user.id, newStatus ? 'active' : 'inactive');
    setIsOnDuty(newStatus);
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
          updatePatrolLocation(user.id, newLocation);
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
      // A pozíció törlését a diszpécser oldalon kezelhetjük, ha a státusz inaktív
      updatePatrolLocation(user.id, { location: null });
    }

    return () => {
      // Cleanup on component unmount
      if (locationWatcher.current) {
        navigator.geolocation.clearWatch(locationWatcher.current);
      }
    };
  }, [isOnDuty, user.id, user.name]);

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
  missions: PropTypes.array.isRequired,
};

export default PatrolView;