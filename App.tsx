import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Routes } from './src/navigation/Routes';
import { UserProvider } from './src/contexts/UserContext';
import { DaysProvider } from './src/contexts/DaysContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <DaysProvider>
          <StatusBar style="dark" />
          <Routes />
        </DaysProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}