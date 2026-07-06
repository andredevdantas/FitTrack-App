import { Router } from 'express';
import { WorkoutController } from '../controllers/WorkoutController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const workoutController = new WorkoutController();

router.post('/:userId/finish', authMiddleware, workoutController.finishWorkout);

export default router;