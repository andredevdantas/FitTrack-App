import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const userController = new UserController();

// Rotas públicas
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/login/google', userController.loginWithGoogle);

// Rotas privadas
router.get('/:id/progress', authMiddleware, userController.getProgress);

export default router;