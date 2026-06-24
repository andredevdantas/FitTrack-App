import { prisma } from '../utils/prisma';

export class UserService {
  async createUser(name: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Este email já está em uso.');
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        streak: {
          create: {
            currentStreak: 0,
            longestStreak: 0,
          }
        }
      },
      include: {
        streak: true,
      }
    });

    return user;
  }

  async getUserProgress(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        streak: true, 
        workouts: true
      }
    });
  }
}