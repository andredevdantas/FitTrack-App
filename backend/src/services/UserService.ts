import { prisma } from '../utils/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_fittrack';
const resend = new Resend(process.env.RESEND_API_KEY);

export class UserService {
  async createUser(name: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Este email já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationCode,
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

    try {
      await resend.emails.send({
        from: 'FitTrack <onboarding@resend.dev>',
        to: email,
        subject: 'FitTrack - Seu código de verificação',
        html: `<p>Olá ${name},</p><p>Seu código de verificação é: <strong>${verificationCode}</strong></p><p>Bora treinar!</p>`
      });
    } catch (error) {
      console.error('Erro ao enviar email via Resend:', error);
    }

    const { password: _, verificationCode: __, ...userWithoutSensitiveData } = user as any;
    return userWithoutSensitiveData;
  }

  async verifyEmailCode(email: string, code: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    if (user.isEmailVerified) {
      throw new Error('Email já está verificado.');
    }

    if (user.verificationCode !== code) {
      throw new Error('Código de verificação inválido.');
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        isEmailVerified: true,
        verificationCode: null,
      }
    });

    const token = jwt.sign({ id: updatedUser.id }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userWithoutPassword } = updatedUser as any;
    
    return { user: userWithoutPassword, token };
  }

  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Credenciais inválidas.');
    }
    if (!user.password) {
      throw new Error('Esta conta foi criada com o Google. Utilize o botão "Continuar com o Google".');
    }

    if (!user.isEmailVerified) {
       throw new Error('Por favor, verifique seu e-mail antes de fazer login.');
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
          data: { googleId, isEmailVerified: true },
        });
      }
    } else {
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          isEmailVerified: true,
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