import { prisma } from '../utils/prisma';

const XP_PER_LEVEL = 500;

export class WorkoutService {
  async registerWorkout(userId: string, title: string, durationMin: number, xpAwarded: number, isMission: boolean = false) {
    
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true }
    });

    if (!currentUser) {
      throw new Error('Utilizador não encontrado');
    }

    const newTotalXp = currentUser.xp + xpAwarded;
    
    const calculatedLevel = Math.floor(newTotalXp / XP_PER_LEVEL) + 1;
    
    const leveledUp = calculatedLevel > currentUser.level;

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
        xp: newTotalXp,
        level: calculatedLevel,
        totalWorkouts: isMission ? undefined : { increment: 1 },
        totalMissions: isMission ? { increment: 1 } : undefined,
      },
    });

    return {
      workout,
      leveledUp,
      newLevel: calculatedLevel
    };
  }
}