import { Router } from 'express';
import { WorkoutController } from '../controllers/WorkoutController';

const router = Router();
const workoutController = new WorkoutController();

router.post('/:userId/finish', workoutController.finishWorkout);

export default router;