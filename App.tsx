import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar style="dark" />
      <Text style={{ fontSize: 18, marginBottom: 20 }}>FitTrack - Configuração Base OK!</Text>
      <ActivityIndicator size="large" color="green" />
    </SafeAreaProvider>
  );
}