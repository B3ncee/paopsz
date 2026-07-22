import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { addDoc, deleteDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { updatePatrolLocation } from '../storageService';

function DispatcherDutyControl({ user, patrolUnits }) {
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const patrolUnitRef = useRef(null);
  const locationWatcher = useRef(null);

  const patrolUnitsCollection = collection(db, 'patrolUnits');

  // Ellenőrizzük, hogy a felhasználó már szolgálatban van-e a komponens betöltésekor
  useEffect(() => {
    const existingUnit = patrolUnits.find(unit => unit.userId === user.id && unit.type === 'dispatcher');
    if (existingUnit) {
      setIsOnDuty(true);
      patrolUnitRef.current = existingUnit.id;
    }
    setIsLoading(false);
  }, [patrolUnits, user.id]);


  const handleToggleDuty = async () => {
    setIsLoading(true);
    const newStatus = !isOnDuty;

    if (newStatus) {
      // Szolgálatba lépés
      try {
        const unitData = {
          name: 'DISP',
          type: 'dispatcher',
          userId: user.id, // Hogy könnyen megtaláljuk
          members: [{ name: user.fullName, phone: user.phoneNumber }],
        };
        const docRef = await addDoc(patrolUnitsCollection, unitData);
        patrolUnitRef.current = docRef.id;
        setIsOnDuty(true);
      } catch (error) {
        console.error("Hiba a diszpécser szolgálatba állításakor:", error);
      }
    } else {
      // Szolgálat befejezése
      try {
        if (patrolUnitRef.current) {
          await deleteDoc(doc(db, 'patrolUnits', patrolUnitRef.current));
          patrolUnitRef.current = null;
        }
        // Pozíció törlése a térképről
        await updatePatrolLocation(user.id, { location: null });
        setIsOnDuty(false);
      } catch (error) {
        console.error("Hiba a diszpécser szolgálat befejezésekor:", error);
      }
    }
    setIsLoading(false);
  };

  // Pozíciókövetés
  useEffect(() => {
    if (isOnDuty) {
      locationWatcher.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updatePatrolLocation(user.id, { name: user.fullName, location: { lat: latitude, lng: longitude }, timestamp: Date.now() });
        },
        (error) => console.error("Hiba a pozíciókövetéskor:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      if (locationWatcher.current) {
        navigator.geolocation.clearWatch(locationWatcher.current);
      }
    }
    return () => locationWatcher.current && navigator.geolocation.clearWatch(locationWatcher.current);
  }, [isOnDuty, user.id, user.fullName]);

  return (
    <div className="duty-control">
      <button onClick={handleToggleDuty} disabled={isLoading} className={`duty-button ${isOnDuty ? 'on-duty' : 'off-duty'}`}>
        {isLoading ? 'Folyamatban...' : (isOnDuty ? 'Szolgálat befejezése' : 'Szolgálatba lépek (DISP)')}
      </button>
    </div>
  );
}

DispatcherDutyControl.propTypes = {
  user: PropTypes.object.isRequired,
  patrolUnits: PropTypes.array.isRequired,
};

export default DispatcherDutyControl;