import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from '../types';

import telaPrincipal from '../screens/telaPrincipal';
import telaMedalhas from '../screens/telaMedalhas';
import telaMissoes from '../screens/telaMissoes';
import telaPerfil from '../screens/telaPerfil';
import { styles, tabBarColors } from '../styles/navigation/TabNavigatorStyles';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: tabBarColors.active,
        tabBarInactiveTintColor: tabBarColors.inactive,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 65 + insets.bottom,
            paddingBottom: 10 + insets.bottom,
          }
        ],
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