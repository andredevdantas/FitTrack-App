import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Routes } from './src/navigation/Routes';
import { UserProvider } from './src/contexts/UserContext';
import { DaysProvider } from './src/contexts/DaysContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
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