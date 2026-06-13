import { DaysOfWeek } from '../types';

export interface Exercise {
  id: string;
  name: string;
  details: string;
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_WORKOUTS: Record<keyof DaysOfWeek, Exercise[]> = {
  segunda: [
    { id: 'seg-1', name: 'Corrida', details: '20 Minutos em Ritmo Leve' },
    { id: 'seg-2', name: 'Flexões de braço', details: '3 Séries de 10 Repetições' },
    { id: 'seg-3', name: 'Agachamentos', details: '3 Séries de 15 Repetições' }
  ],
  terca: [
    { id: 'ter-1', name: 'Caminhada', details: '30 Minutos' },
    { id: 'ter-2', name: 'Burpees', details: '2 Séries de 15 Repetições' },
    { id: 'ter-3', name: 'Abdominais', details: '3 Séries de 20 Repetições' }
  ],
  quarta: [
    { id: 'qua-1', name: 'Levantamento de Pernas', details: '3 Séries de 12 Repetições' },
    { id: 'qua-2', name: 'Yoga', details: '10 Minutos de Alongamento' },
    { id: 'qua-3', name: 'Elevações de Quadril', details: '3 Séries de 20 Repetições' }
  ],
  quinta: [
    { id: 'qui-1', name: 'Pular Corda', details: '2 Minutos' },
    { id: 'qui-2', name: 'Abdominais Bicicleta', details: '5 Séries de 10 Repetições' },
    { id: 'qui-3', name: 'Avanços (Lunges)', details: '15 para cada perna' }
  ],
  sexta: [
    { id: 'sex-1', name: 'Caminhada Rápida', details: '20 Minutos' },
    { id: 'sex-2', name: 'Super-Homens (Lombar)', details: '3 Séries de 15 Repetições' },
    { id: 'sex-3', name: 'HIIT Corrida', details: '1 Min Corrida / 1 Min Caminhada (3x)' }
  ]
};

const MOCK_MISSIONS: DailyMission[] = [
  { id: 'm-1', description: '20 Minutos de Corrida Leve', xp: 50 },
  { id: 'm-2', description: '10 Flexões de Braço', xp: 30 },
  { id: 'm-3', description: '15 Agachamentos', xp: 30 },
  { id: 'm-4', description: '5 Minutos de Prancha', xp: 40 },
  { id: 'm-5', description: '20 Abdominais', xp: 20 },
  { id: 'm-6', description: '3 Séries de Polichinelos', xp: 30 },
  { id: 'm-7', description: '10 Burpees', xp: 50 },
  { id: 'm-8', description: '10 Minutos de Yoga', xp: 40 }
];

const MOCK_MEDALS: Medal[] = [
  { id: 'md-1', name: 'Primeiro Suor', description: 'Conclua o seu primeiro treino', type: 'workouts', requirement: 1, icon: 'shoe-prints', color: '#3498DB' },
  { id: 'md-2', name: 'Iniciante', description: 'Acumule 100 XP', type: 'xp', requirement: 100, icon: 'medal', color: '#CD7F32' },
  { id: 'md-3', name: 'Caçador', description: 'Complete 10 missões', type: 'missions', requirement: 10, icon: 'clipboard-check', color: '#1ABC9C' },
  { id: 'md-4', name: 'Consistente', description: 'Conclua 5 treinos semanais', type: 'workouts', requirement: 5, icon: 'running', color: '#9B59B6' },
  { id: 'md-5', name: 'Máquina', description: 'Acumule 500 XP', type: 'xp', requirement: 500, icon: 'bolt', color: '#F1C40F' },
  { id: 'md-6', name: 'Lenda', description: 'Complete 50 missões', type: 'missions', requirement: 50, icon: 'crown', color: '#E74C3C' }
];

export const WorkoutService = {
  async fetchWeeklyPlan(): Promise<Record<keyof DaysOfWeek, Exercise[]>> {
    await delay(800);
    return MOCK_WORKOUTS;
  },

  async fetchDailyMissions(): Promise<DailyMission[]> {
    await delay(600);
    const shuffled = [...MOCK_MISSIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  },

  async fetchMedals(): Promise<Medal[]> {
    await delay(500);
    return MOCK_MEDALS;
  }
};