import NetInfo from '@react-native-community/netinfo';
import { DaysOfWeek } from '../types';
import { api } from './api';
import { StorageService, StorageKeys } from '../storage/StorageService';

export interface Exercise {
  id: string;
  name: string;
  details: string;
  dayOfWeek?: string;
}

export interface DailyMission {
  id: string;
  description: string;
  xp: number;
}

export interface Medal {
  id: string;
  name: string;
  description: string;
  type: 'xp' | 'missions' | 'workouts';
  requirement: number;
  icon: string;
  color: string;
}

export interface QueuedWorkout {
  id: string;
  userId: string;
  title: string;
  durationMin: number;
  xpAwarded: number;
  isMission: boolean;
}

export const WorkoutService = {
  async fetchWeeklyPlan(): Promise<Record<keyof DaysOfWeek, Exercise[]>> {
    try {
      const response = await api.get('/catalog/exercises');
      const exercises: Exercise[] = response.data;
      
      const weeklyPlan = {
        segunda: exercises.filter(e => e.dayOfWeek === 'segunda'),
        terca: exercises.filter(e => e.dayOfWeek === 'terca'),
        quarta: exercises.filter(e => e.dayOfWeek === 'quarta'),
        quinta: exercises.filter(e => e.dayOfWeek === 'quinta'),
        sexta: exercises.filter(e => e.dayOfWeek === 'sexta'),
        sabado: exercises.filter(e => e.dayOfWeek === 'sabado'),
        domingo: exercises.filter(e => e.dayOfWeek === 'domingo'),
      };
      
      return weeklyPlan as Record<keyof DaysOfWeek, Exercise[]>;
    } catch (error) {
      console.error('Erro ao buscar plano semanal na API:', error);
      throw error;
    }
  },

  async fetchDailyMissions(): Promise<DailyMission[]> {
    try {
      const response = await api.get('/catalog/missions');
      const missions: DailyMission[] = response.data;
      
      const shuffled = [...missions].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 5);
    } catch (error) {
      console.error('Erro ao buscar missões diárias na API:', error);
      throw error;
    }
  },

  async fetchMedals(): Promise<Medal[]> {
    try {
      const response = await api.get('/catalog/medals');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar medalhas na API:', error);
      throw error;
    }
  },

  async finishWorkoutAPI(userId: string, title: string, durationMin: number, xpAwarded: number, isMission: boolean = false) {
    try {
      const networkState = await NetInfo.fetch();
      if (!networkState.isConnected) {
        console.log('Modo Offline: Salvando na fila de sincronização...');
        const queue = await StorageService.getItem<QueuedWorkout[]>(StorageKeys.OFFLINE_QUEUE) || [];
        
        const newOfflineItem: QueuedWorkout = {
          id: Math.random().toString(36).substr(2, 9),
          userId, title, durationMin, xpAwarded, isMission
        };
        
        await StorageService.setItem(StorageKeys.OFFLINE_QUEUE, [...queue, newOfflineItem]);
        return {
          streak: { currentStreak: 'Sincronizando...' },
          offline: true
        };
      }

      const response = await api.post(`/workouts/${userId}/finish`, {
        title,
        durationMin,
        xpAwarded,
        isMission
      });
      return response.data; 
    } catch (error: any) {
      console.error('Erro ao salvar treino na nuvem:', error.response?.data || error.message);
      throw error;
    }
  },

  async syncOfflineQueue() {
    const queue = await StorageService.getItem<QueuedWorkout[]>(StorageKeys.OFFLINE_QUEUE) || [];
    if (queue.length === 0) return;

    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) return;

    console.log(`[SyncService] Sincronizando ${queue.length} pacotes offline...`);
    const failedItems: QueuedWorkout[] = [];

    for (const item of queue) {
      try {
        await api.post(`/workouts/${item.userId}/finish`, {
          title: item.title,
          durationMin: item.durationMin,
          xpAwarded: item.xpAwarded,
          isMission: item.isMission
        });
        console.log(`[SyncService] Sincronizado com sucesso: ${item.title}`);
      } catch (error) {
        console.error(`[SyncService] Falha ao sincronizar: ${item.title}`);
        failedItems.push(item);
      }
    }

    await StorageService.setItem(StorageKeys.OFFLINE_QUEUE, failedItems);
  }
};