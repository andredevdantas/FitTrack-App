export interface Streak {
  id: string;
  currentStreak: number;
  longestStreak: number;
  lastActive: string | Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  totalWorkouts: number;
  totalMissions: number;
  streak?: Streak;
}

export interface Mission {
  id: string;
  description: string;
  completed: boolean;
}

export interface Medal {
  id: string;
  name: string;
  unlocked: boolean;
}

export interface DaysOfWeek {
  segunda: boolean;
  terca: boolean;
  quarta: boolean;
  quinta: boolean;
  sexta: boolean;
  sabado: boolean;
  domingo: boolean;
}

export type RootStackParamList = {
  Login: undefined;
  Verificacao: { email: string };
  MainTabs: undefined;
};

export type MainTabParamList = {
  Principal: undefined;
  Medalhas: undefined;
  Missoes: undefined;
  Perfil: undefined;
};