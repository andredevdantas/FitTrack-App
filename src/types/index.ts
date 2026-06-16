export interface User {
  nome?: string;
  idade: string;
  peso: string;
  altura: string;
  fotoUri?: string;
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
  MainTabs: undefined;
};

export type MainTabParamList = {
  Principal: undefined;
  Medalhas: undefined;
  Missoes: undefined;
  Perfil: undefined;
};