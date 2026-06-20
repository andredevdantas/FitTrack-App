import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  },

  async scheduleDailyReminder() {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔥 Não perca a sua ofensiva!',
        body: 'Ainda dá tempo de treinar hoje. Venha garantir o seu XP e manter o seu Streak ativo!',
        sound: true,
      },
      trigger: {
        hour: 19,
        minute: 0,
        repeats: true,
      } as any, 
    });
  },

  async cancelAllReminders() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
};