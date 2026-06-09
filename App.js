import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, StyleSheet, ActivityIndicator, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { DaysProvider } from './src/context/DaysContext';
import { UserDataProvider } from './src/context/UserDataContext';
import * as db from './src/utilites/globalFunctions';

import {
  telaPrincipal,
  telaMedalhas,
  telaUsuario,
  telaMissoes,
  TelaLogin,
} from './src/views';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: 'green',
      tabBarInactiveTintColor: 'black',
      tabBarItemStyle: styles.tabBarItem,
      tabBarStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopColor: 'black',
        borderTopWidth: 2,
        height: 75,
      },
    }}>
    <Tab.Screen
      name="Principal"
      component={telaPrincipal}
      options={{
        tabBarIcon: ({ color }) => (
          <Image
            source={require('./assets/tamagotchi_icon.png')}
            style={{ width: 40, height: 40, tintColor: color }}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Medalha"
      component={telaMedalhas}
      options={{
        tabBarIcon: ({ color }) => (
          <FontAwesome5 name="medal" size={40} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Missões"
      component={telaMissoes}
      options={{
        tabBarIcon: ({ color }) => (
          <FontAwesome5 name="clipboard-list" size={40} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Usuário"
      component={telaUsuario}
      options={{
        tabBarIcon: ({ color }) => (
          <FontAwesome5 name="user-alt" size={40} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  const [isFirstTime, setIsFirstTime] = useState(null);

  useEffect(() => {
    const checkFirstTime = async () => {
      const firstTimeValue = await db.getData('firstTime');
      setIsFirstTime(!firstTimeValue); // Se não houver valor, é a primeira vez
    };
    checkFirstTime();
  }, []);

  if (isFirstTime === null) {
    // Exibe um indicador de carregamento enquanto verifica o valor de isFirstTime
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <DaysProvider>
      <UserDataProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isFirstTime ? 'Login' : 'Main'}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={TelaLogin} />
            <Stack.Screen name="Main" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserDataProvider>
    </DaysProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  tabBarItem: {
    flex: 1,
    borderRightWidth: 2,
    borderRightColor: 'black',
  },
});
