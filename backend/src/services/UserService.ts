import { prisma } from '../utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_fittrack';

export class UserService {
  async createUser(name: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Este email já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
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

    const { password: _, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }

  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Credenciais inválidas.');
    }
    if (!user.password) {
      throw new Error('Esta conta foi criada com o Google. Utilize o botão "Continuar com o Google".');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas.');
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    const { password: _, ...userWithoutPassword } = user as any;
    return { user: userWithoutPassword, token };
  }

  async loginWithGoogle(email: string, name: string, googleId: string) {
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { email },
          data: { googleId },
        });
      }
    } else {
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          streak: {
            create: {
              currentStreak: 0,
              longestStreak: 0,
            }
          }
        }
      });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    const { password: _, ...userWithoutPassword } = user as any;
    return { user: userWithoutPassword, token };
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