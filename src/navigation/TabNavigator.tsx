import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { MainTabParamList } from '../types';

import telaPrincipal from '../screens/telaPrincipal';
import telaMedalhas from '../screens/telaMedalhas';
import telaMissoes from '../screens/telaMissoes';
import telaPerfil from '../screens/telaPerfil';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#27AE60',
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E8E8',
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        tabBarIcon: ({ color }) => {
          let iconName = '';

          if (route.name === 'Principal') {
            iconName = 'home';
          } else if (route.name === 'Medalhas') {
            iconName = 'medal';
          } else if (route.name === 'Missoes') {
            iconName = 'clipboard-list';
          } else if (route.name === 'Perfil') {
            iconName = 'user-alt';
          }

          return <FontAwesome5 name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Principal" component={telaPrincipal} />
      <Tab.Screen name="Medalhas" component={telaMedalhas} />
      <Tab.Screen name="Missoes" component={telaMissoes} />
      <Tab.Screen name="Perfil" component={telaPerfil} />
    </Tab.Navigator>
  );
}