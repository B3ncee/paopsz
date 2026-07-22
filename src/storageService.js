import { db, auth } from './firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, setDoc, getDocs, query, where, deleteDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword } from "firebase/auth";

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

export const streamLogs = (callback) => {
  const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'));
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
      console.error(`Error streaming logs:`, error);
    }
  );
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

export const forceUpdatePassword = async (newPassword) => {
    if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        // Jelszóváltoztatás jelző törlése a Firestore-ból
        const userProfileRef = doc(db, 'users', auth.currentUser.uid); // Feltételezzük, hogy a doc ID a uid
        await updateDoc(userProfileRef, { mustChangePassword: false });
    } else {
        throw new Error("Nincs bejelentkezett felhasználó.");
    }
};

export const addLog = async (message) => {
  await addDoc(collection(db, 'logs'), {
    message,
    timestamp: serverTimestamp(),
  });
};

export const addUserProfile = async (profileData) => {
  // A dokumentum ID-ja legyen a felhasználó UID-ja a könnyebb kezelhetőségért
  await setDoc(doc(db, 'users', profileData.uid), profileData);
  await addLog(`"${profileData.fullName}" nevű felhasználó létrehozva.`);
};

export const createUser = async (email, password, role, fullName, phoneNumber) => {
  // 1. Felhasználó létrehozása az Authentication rendszerben
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // 2. Felhasználói profil létrehozása a Firestore-ban
  const profileData = {
    uid: firebaseUser.uid,
    fullName,
    email,
    phoneNumber,
    role,
    status: 'inactive',
    mustChangePassword: true, // Az új felhasználóknak kötelező jelszót változtatniuk
  };
  await addUserProfile(profileData);
  return firebaseUser;
};

export const deleteUser = async (userId) => {
  // Figyelem: Ez csak a Firestore profilt törli.
  // Az Auth felhasználó törléséhez Cloud Function szükséges,
  // mert ez egy adminisztrátori művelet, amit kliens oldalról biztonsági okokból nem lehet végrehajtani.
  // A jelenlegi implementáció csak a Firestore adatbázisból törli a felhasználót.
  await deleteDoc(doc(db, 'users', userId));
};

export const addMission = async (missionData) => {
  await addDoc(collection(db, 'missions'), missionData);
};

export const addPatrolUnit = async (unitData) => {
  const docRef = await addDoc(collection(db, 'patrolUnits'), unitData);
  await addLog(`"${unitData.name}" nevű egység létrehozva.`);
  return docRef;
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