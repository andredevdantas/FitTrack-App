import { Router } from 'express';
import { CatalogController } from '../controllers/CatalogController';

const router = Router();
const catalogController = new CatalogController();

router.get('/exercises', catalogController.fetchExercises);
router.get('/missions', catalogController.fetchMissions);
router.get('/medals', catalogController.fetchMedals);

export default router;