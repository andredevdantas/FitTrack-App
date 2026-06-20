import { StyleSheet } from 'react-native';

export const getStyles = (theme: any) => StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
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

export const getTabBarColors = (theme: any) => ({
  active: theme.colors.primary,
  inactive: theme.colors.inactive || theme.colors.textMuted,
});