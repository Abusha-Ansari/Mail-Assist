// context/UserContext.tsx
'use client';

import { getUserProfile } from '@/utils/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

type UserProfile = {
  id: string;
  username: string;
  credits: number;
};

type UserContextType = {
  user: UserProfile | null;
  loading: boolean;
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  setUser: (user: UserProfile | null) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  loggedIn: false,
  setLoggedIn: () => {},
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const profile = await getUserProfile();
        if (profile) {
          setUser(profile);
          setLoggedIn(true);
        } else {
          setUser(null);
          setLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser ,  loading, loggedIn, setLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
