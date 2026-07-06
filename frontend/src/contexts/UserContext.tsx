import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { StorageService } from '../storage/StorageService'; 
import { api } from '../services/api';
import { User } from '../types';

interface UserContextData {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  fetchProgress: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextData>({} as UserContextData);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    setIsLoading(true);
    try {
      const storedToken = await StorageService.getItem<string>('USER_TOKEN');
      const storedUserId = await StorageService.getItem<string>('USER_ID');
      
      if (storedToken && storedUserId) {
        await fetchProgress(storedUserId);
      }
    } catch (error) {
      console.error('Erro ao carregar sessão local:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProgress = async (id: string) => {
    try {
      const response = await api.get(`/users/${id}/progress`);
      setUser(response.data);
    } catch (error) {
      console.error('Erro ao buscar progresso na API:', error);
      await logout(); 
    }
  };

  const login = async (email: string, password = 'senha_padrao') => {
    setIsLoading(true);
    try {
      const response = await api.post('/users/login', { email, password });
      const { user: loggedUser, token } = response.data;
      
      setUser(loggedUser);
      
      await StorageService.setItem('USER_TOKEN', token);
      await StorageService.setItem('USER_ID', loggedUser.id);
    } catch (error: any) {
      console.error('Erro no login:', error.response?.data || error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password = 'senha_padrao') => {
    setIsLoading(true);
    try {
      await api.post('/users/register', { name, email, password });
      await login(email, password);
    } catch (error: any) {
      console.error('Erro ao registrar na API:', error.response?.data || error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await StorageService.removeItem('USER_ID');
    await StorageService.removeItem('USER_TOKEN');
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, register, fetchProgress, logout }}>
      {children}
    </UserContext.Provider>
  );
};