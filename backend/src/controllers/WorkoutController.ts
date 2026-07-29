import { Request, Response } from 'express';
import { WorkoutService } from '../services/WorkoutService';

const workoutService = new WorkoutService();

export class WorkoutController {
  
  async startWorkout(req: Request, res: Response) {
    try {
      const userId = req.params.userId as string;
      await workoutService.startWorkoutSession(userId);
      return res.status(200).json({ message: 'Sessão de treino iniciada com segurança no servidor.' });
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao iniciar sessão de treino.' });
    }
  }

  async finishWorkout(req: Request, res: Response) {
    try {
      const userId = req.params.userId as string;
      const { title, isMission } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Título do treino é obrigatório.' });
      }

      const workout = await workoutService.registerWorkout(userId, title, Boolean(isMission));
      return res.status(201).json(workout);
      
    } catch (error: any) {
      const isValidationError = error.message.includes('Sessão') || error.message.includes('curto');
      return res.status(isValidationError ? 400 : 500).json({ error: error.message || 'Erro ao registrar o treino.' });
    }
  }
}