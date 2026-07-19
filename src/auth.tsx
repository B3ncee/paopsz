import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUser as createUserInStore,
  getUserBySession,
  getUsers,
  seedDefaultData,
  setSessionUserId,
  StoredUser,
  updateUser,
} from './store';

export interface UserData {
  uid: string;
  email: string;
  role: 'patrol' | 'coordinator' | 'leader';
  name: string;
  phone: string;
  teamId?: string;
}

interface AuthContextValue {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  registerCoordinator: (email: string, password: string, name: string, phone: string) => Promise<StoredUser>;
  createUser: (email: string, password: string, role: UserData['role'], name: string, phone: string, teamId?: string) => Promise<StoredUser>;
  saveProfile: (profile: Partial<Omit<UserData, 'uid' | 'email'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function omitPassword(user: StoredUser): UserData {
  const { password, ...rest } = user;
  return rest;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedDefaultData();
    const currentUser = getUserBySession();
    if (currentUser) {
      setUser(omitPassword(currentUser));
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const users = getUsers();
    const found = users.find((candidate) => candidate.email === email && candidate.password === password);
    if (!found) {
      throw new Error('Helytelen email vagy jelszó.');
    }
    setSessionUserId(found.uid);
    setUser(omitPassword(found));
  }

  async function logout() {
    setSessionUserId(null);
    setUser(null);
  }

  async function registerCoordinator(email: string, password: string, name: string, phone: string) {
    const newUser = await createUserInStore({
      email,
      password,
      role: 'coordinator',
      name,
      phone,
    });
    return newUser;
  }

  async function createUser(email: string, password: string, role: UserData['role'], name: string, phone: string, teamId?: string) {
    const newUser = await createUserInStore({
      email,
      password,
      role,
      name,
      phone,
      teamId,
    });
    return newUser;
  }

  async function saveProfile(profile: Partial<Omit<UserData, 'uid' | 'email'>>) {
    if (!user) return;
    updateUser(user.uid, profile);
    setUser({ ...user, ...profile });
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, registerCoordinator, createUser, saveProfile }}>
      {children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
