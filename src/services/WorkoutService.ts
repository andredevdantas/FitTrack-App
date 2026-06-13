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
  xpRequired: number;
  icon: string;
  color: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_WORKOUTS: Record<keyof DaysOfWeek, Exercise[]> = {
  segunda: [
    { id: 'seg-1', name: 'Corrida', details: '20 minutos em ritmo leve' },
    { id: 'seg-2', name: 'Flexões de braço', details: '3 séries de 10 repetições' },
    { id: 'seg-3', name: 'Agachamentos', details: '3 séries de 15 repetições' }
  ],
  terca: [
    { id: 'ter-1', name: 'Caminhada', details: '30 minutos' },
    { id: 'ter-2', name: 'Burpees', details: '2 séries de 15 repetições' },
    { id: 'ter-3', name: 'Abdominais', details: '3 séries de 20 repetições' }
  ],
  quarta: [
    { id: 'qua-1', name: 'Levantamento de pernas', details: '3 séries de 12 repetições' },
    { id: 'qua-2', name: 'Yoga', details: '10 minutos de alongamento' },
    { id: 'qua-3', name: 'Elevações de quadril', details: '3 séries de 20 repetições' }
  ],
  quinta: [
    { id: 'qui-1', name: 'Pular corda', details: '2 minutos' },
    { id: 'qui-2', name: 'Abdominais bicicleta', details: '5 séries de 10 repetições' },
    { id: 'qui-3', name: 'Avanços (Lunges)', details: '15 para cada perna' }
  ],
  sexta: [
    { id: 'sex-1', name: 'Caminhada rápida', details: '20 minutos' },
    { id: 'sex-2', name: 'Super-homens (Lombar)', details: '3 séries de 15 repetições' },
    { id: 'sex-3', name: 'HIIT Corrida', details: '1 min corrida / 1 min caminhada (3x)' }
  ]
};

const MOCK_MISSIONS: DailyMission[] = [
  { id: 'm-1', description: '20 Minutos de Corrida leve', xp: 50 },
  { id: 'm-2', description: '10 Flexões de Braço', xp: 30 },
  { id: 'm-3', description: '15 Agachamentos', xp: 30 },
  { id: 'm-4', description: '5 Minutos de Prancha', xp: 40 },
  { id: 'm-5', description: '20 Abdominais', xp: 20 },
  { id: 'm-6', description: '3 Séries de Polichinelos', xp: 30 },
  { id: 'm-7', description: '10 Burpees', xp: 50 },
  { id: 'm-8', description: '10 Minutos de Yoga', xp: 40 }
];

const MOCK_MEDALS: Medal[] = [
  { id: 'md-1', name: 'Primeiro Passo', description: 'Iniciou a jornada', xpRequired: 0, icon: 'shoe-prints', color: '#3498DB' },
  { id: 'md-2', name: 'Iniciante', description: 'Alcançou 100 XP', xpRequired: 100, icon: 'medal', color: '#CD7F32' },
  { id: 'md-3', name: 'Consistente', description: 'Alcançou 300 XP', xpRequired: 300, icon: 'medal', color: '#BDC3C7' },
  { id: 'md-4', name: 'Mestre', description: 'Alcançou 600 XP', xpRequired: 600, icon: 'trophy', color: '#F1C40F' },
  { id: 'md-5', name: 'Lenda', description: 'Alcançou 1000 XP', xpRequired: 1000, icon: 'crown', color: '#9B59B6' },
  { id: 'md-6', name: 'Imparável', description: 'Alcançou 2000 XP', xpRequired: 2000, icon: 'fire', color: '#E74C3C' }
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