import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
      }

      const user = await userService.createUser(name, email, password);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
      }

      const data = await userService.loginUser(email, password);
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  async getProgress(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const progress = await userService.getUserProgress(id);
      
      if (!progress) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
      
      return res.status(200).json(progress);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao buscar progresso.' });
    }
  }
}