import { DaysOfWeek } from '../types';
import { api } from './api';

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

  async finishWorkoutAPI(userId: string, title: string, durationMin: number, xpAwarded: number) {
    try {
      const response = await api.post(`/workouts/${userId}/finish`, {
        title,
        durationMin,
        xpAwarded
      });
      return response.data; 
    } catch (error: any) {
      console.error('Erro ao salvar treino na nuvem:', error.response?.data || error.message);
      throw error;
    }
  }
};