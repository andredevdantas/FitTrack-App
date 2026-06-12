import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  USER: '@FitTrack:user',
  IS_FIRST_TIME: '@FitTrack:isFirstTime',
  SELECTED_DAYS: '@FitTrack:selectedDays',
  MISSIONS: '@FitTrack:missions',
  MISSIONS_DATE: '@FitTrack:missionsDate',
  MEDALS: '@FitTrack:medals',
  PRINCIPAL_COMPLETION: '@FitTrack:principalCompletion',
  PRINCIPAL_LAST_DATE: '@FitTrack:principalLastDate',
  MISSOES_LIST: '@FitTrack:missoesList',
  MISSOES_COMPLETED: '@FitTrack:missoesCompleted',
  MISSOES_REROLLS: '@FitTrack:missoesRerolls',
  MISSOES_LAST_DATE: '@FitTrack:missoesLastDate',
};

export const StorageService = {
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Erro ao salvar dados na chave ${key}`, error);
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Erro ao recuperar dados da chave ${key}`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao remover dados da chave ${key}`, error);
    }
  },
};