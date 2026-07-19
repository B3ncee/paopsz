import { db, auth } from './firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// --- Valós idejű adatfolyamok ---
const streamData = (collectionName, callback) => {
  const q = collection(db, collectionName);
  return onSnapshot(
    q,
    (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      callback(data);
    },
    (error) => {
      console.error(`Error streaming ${collectionName}:`, error);
    }
  );
};

export const streamUsers = (callback) => streamData('users', callback);
export const streamMissions = (callback) => streamData('missions', callback);
export const streamPatrolUnits = (callback) => streamData('patrolUnits', callback);
export const streamPatrolLocations = (callback) => {
    const q = collection(db, 'patrolLocations');
    return onSnapshot(
      q,
      (querySnapshot) => {
        const locations = {};
        querySnapshot.forEach((doc) => {
            locations[doc.id] = { id: doc.id, ...doc.data() };
        });
        callback(locations);
      },
      (error) => {
        console.error(`Error streaming patrolLocations:`, error);
      });
};

// --- Adatmódosító funkciók ---

// --- Authentication Funkciók ---

export const signUp = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const logIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // A bejelentkezés után le kell kérnünk a felhasználó adatait (pl. szerepkör) a Firestore-ból
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", userCredential.user.uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        throw new Error("A felhasználóhoz nem tartozik adatlap a Firestore-ban.");
    }

    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
};

export const logOut = () => signOut(auth);

export const addUserProfile = async (uid, profileData) => { // uid can be null
  const dataToSave = { ...profileData };
  if (uid) {
    dataToSave.uid = uid;
  }
  await addDoc(collection(db, 'users'), dataToSave);
};

export const addMission = async (missionData) => {
  await addDoc(collection(db, 'missions'), missionData);
};

export const addPatrolUnit = async (unitData) => {
  await addDoc(collection(db, 'patrolUnits'), unitData);
};

export const updatePatrolUnit = async (unitId, unitData) => {
    const unitDocRef = doc(db, 'patrolUnits', unitId);
    await updateDoc(unitDocRef, unitData);
};

export const updateUserStatus = async (userId, status) => {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { status });
};

export const updatePatrolLocation = async (userId, locationData) => {
    const locationDocRef = doc(db, 'patrolLocations', userId);
    await setDoc(locationDocRef, locationData, { merge: true });
};