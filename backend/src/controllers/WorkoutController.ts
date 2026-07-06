import { Request, Response } from 'express';
import { WorkoutService } from '../services/WorkoutService';

const workoutService = new WorkoutService();

export class WorkoutController {
  async finishWorkout(req: Request, res: Response) {
    try {
      const userId = req.params.userId as string;
      const { title, durationMin, xpAwarded, isMission } = req.body;

      if (!title || !durationMin || !xpAwarded) {
        return res.status(400).json({ error: 'Dados do treino incompletos.' });
      }

      const workout = await workoutService.registerWorkout(userId, title, durationMin, xpAwarded, Boolean(isMission));
      return res.status(201).json(workout);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao registrar o treino.' });
    }
  }
}