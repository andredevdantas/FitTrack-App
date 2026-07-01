import { prisma } from '../utils/prisma';

export class CatalogService {
  async getExercises() {
    return await prisma.exercise.findMany();
  }

  async getDailyMissions() {
    return await prisma.dailyMission.findMany();
  }

  async getMedals() {
    return await prisma.medal.findMany();
  }
}