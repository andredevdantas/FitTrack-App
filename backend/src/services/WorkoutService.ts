import { prisma } from '../utils/prisma';

const XP_PER_LEVEL = 500;
const MIN_WORKOUT_SECONDS = 20;
const STANDARD_XP = 150; 

export class WorkoutService {
  
  async startWorkoutSession(userId: string) {
    await prisma.activeSession.deleteMany({
      where: { userId }
    });
    
    const session = await prisma.activeSession.create({
      data: { userId }
    });
    
    return session;
  }

  async registerWorkout(userId: string, title: string, isMission: boolean = false) {
    
    const session = await prisma.activeSession.findUnique({
      where: { userId }
    });

    if (!session) {
      throw new Error('Sessão de treino não encontrada. Possível tentativa de fraude.');
    }

    const now = new Date();
    const diffInSeconds = (now.getTime() - session.startTime.getTime()) / 1000;
    const durationMin = Math.max(1, Math.floor(diffInSeconds / 60));

    if (diffInSeconds < MIN_WORKOUT_SECONDS) {
      throw new Error(`Treino muito curto. O tempo mínimo é de ${MIN_WORKOUT_SECONDS} segundos.`);
    }

    await prisma.activeSession.delete({
      where: { userId }
    });

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true }
    });

    if (!currentUser) {
      throw new Error('Utilizador não encontrado');
    }

    const newTotalXp = currentUser.xp + STANDARD_XP;
    const calculatedLevel = Math.floor(newTotalXp / XP_PER_LEVEL) + 1;
    const leveledUp = calculatedLevel > currentUser.level;

    const workout = await prisma.workout.create({
      data: {
        title,
        durationMin,
        xpAwarded: STANDARD_XP,
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
      newLevel: calculatedLevel,
      realDurationMin: durationMin
    };
  }
}