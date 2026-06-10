// src/contexts/UserContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { StorageService, StorageKeys } from '../storage/StorageService';
import { User } from '../types';

interface UserContextData {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  updateUser: (newData: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

export const UserContext = createContext<UserContextData>({} as UserContextData);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const storedUser = await StorageService.getItem<User>(StorageKeys.USER);
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  };

  const updateUser = async (newData: Partial<User>) => {
    const updatedUser = { ...user, ...newData } as User;
    setUser(updatedUser);
    await StorageService.setItem(StorageKeys.USER, updatedUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};