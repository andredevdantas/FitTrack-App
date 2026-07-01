import { Request, Response } from 'express';
import { CatalogService } from '../services/CatalogService';

const catalogService = new CatalogService();

export class CatalogController {
  async fetchExercises(req: Request, res: Response) {
    try {
      const exercises = await catalogService.getExercises();
      return res.status(200).json(exercises);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar o catálogo de exercícios.' });
    }
  }

  async fetchMissions(req: Request, res: Response) {
    try {
      const missions = await catalogService.getDailyMissions();
      return res.status(200).json(missions);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar as missões diárias.' });
    }
  }

  async fetchMedals(req: Request, res: Response) {
    try {
      const medals = await catalogService.getMedals();
      return res.status(200).json(medals);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar o catálogo de medalhas.' });
    }
  }
}