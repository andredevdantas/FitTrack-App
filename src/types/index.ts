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
}