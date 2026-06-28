import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Routes } from './src/navigation/Routes';
import { UserProvider } from './src/contexts/UserContext';
import { DaysProvider } from './src/contexts/DaysContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { NotificationService } from './src/services/NotificationService';
import { api } from './src/services/api';

export default function App() {
  
  useEffect(() => {
    const initNotifications = async () => {
      const hasPermission = await NotificationService.requestPermissions();
      
      if (hasPermission) {
        await NotificationService.scheduleDailyReminder();
      }
    };
    initNotifications();
    const testConnection = async () => {
      try {
        const response = await api.get('/ping');
        console.log('CONEXÃO BEM-SUCEDIDA! O backend respondeu:', response.data.message);
      } catch (error: any) {
        console.error('ERRO DE CONEXÃO COM A API:', error.message);
      }
    };
    testConnection();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserProvider>
          <DaysProvider>
            <StatusBar style="auto" />
            <Routes />
          </DaysProvider>
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}