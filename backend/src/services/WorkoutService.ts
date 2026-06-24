import { prisma } from '../utils/prisma';

export class WorkoutService {
  async registerWorkout(userId: string, title: string, durationMin: number, xpAwarded: number) {

    const workout = await prisma.workout.create({
      data: {
        title,
        durationMin,
        xpAwarded,
        userId,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: {
          increment: xpAwarded,
        },
      },
    });

    return workout;
  }
}