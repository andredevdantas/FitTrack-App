import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tabBar: {
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
});

export const tabBarColors = {
  active: '#27AE60',
  inactive: '#A0A0A0',
};