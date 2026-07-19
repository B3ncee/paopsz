import { db } from './firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, setDoc } from 'firebase/firestore';

// --- Valós idejű adatfolyamok ---
const streamData = (collectionName, callback) => {
  const q = collection(db, collectionName);
  return onSnapshot(q, (querySnapshot) => {
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    callback(data);
  });
};

export const streamUsers = (callback) => streamData('users', callback);
export const streamMissions = (callback) => streamData('missions', callback);
export const streamPatrolUnits = (callback) => streamData('patrolUnits', callback);
export const streamPatrolLocations = (callback) => {
    const q = collection(db, 'patrolLocations');
    return onSnapshot(q, (querySnapshot) => {
        const locations = {};
        querySnapshot.forEach((doc) => {
            locations[doc.id] = { id: doc.id, ...doc.data() };
        });
        callback(locations);
    });
};

// --- Adatmódosító funkciók ---

export const addUser = async (userData) => {
  await addDoc(collection(db, 'users'), userData);
};

export const addMission = async (missionData) => {
  await addDoc(collection(db, 'missions'), missionData);
};

export const addPatrolUnit = async (unitData) => {
  await addDoc(collection(db, 'patrolUnits'), unitData);
};

export const updateUserStatus = async (userId, status) => {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { status });
};

export const updatePatrolLocation = async (userId, locationData) => {
    const locationDocRef = doc(db, 'patrolLocations', userId);
    await setDoc(locationDocRef, locationData, { merge: true });
};