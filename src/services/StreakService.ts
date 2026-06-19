import { StorageService, StorageKeys } from '../storage/StorageService';

export const StreakService = {

  async getStreak(): Promise<number> {
    const lastDateStr = await StorageService.getItem<string>(StorageKeys.STREAK_LAST_DATE);
    const currentStreak = await StorageService.getItem<number>(StorageKeys.STREAK_COUNT) || 0;

    if (!lastDateStr) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = new Date(lastDateStr);
    lastActivity.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1 && lastDateStr !== today.toDateString()) {
      await StorageService.setItem(StorageKeys.STREAK_COUNT, 0);
      return 0;
    }

    return currentStreak;
  },

  async recordActivity(): Promise<number> {
    const todayStr = new Date().toDateString();
    const lastDateStr = await StorageService.getItem<string>(StorageKeys.STREAK_LAST_DATE);
    let currentStreak = await StorageService.getItem<number>(StorageKeys.STREAK_COUNT) || 0;

    if (lastDateStr === todayStr) {
      return currentStreak;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastDateStr === yesterdayStr) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    await StorageService.setItem(StorageKeys.STREAK_COUNT, currentStreak);
    await StorageService.setItem(StorageKeys.STREAK_LAST_DATE, todayStr);

    return currentStreak;
  }
};