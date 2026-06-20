import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { StorageService, StorageKeys } from '../storage/StorageService';
import { RootStackParamList } from '../types';

import telaLogin from '../screens/telaLogin';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Routes() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);

  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    const firstTimeValue = await StorageService.getItem<boolean>(StorageKeys.IS_FIRST_TIME);
    setIsFirstTime(firstTimeValue === null ? true : firstTimeValue);
  };

  if (isFirstTime === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F7F6' }}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isFirstTime ? 'Login' : 'MainTabs'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={telaLogin} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}