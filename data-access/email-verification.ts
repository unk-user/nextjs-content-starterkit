import prisma from '@/lib/db';
import jwt from 'jsonwebtoken';
import { TimeSpan, createDate } from 'oslo';

export async function createEmailVerification(userId: string) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!);
  return await prisma.emailVerification.create({
    data: {
      userId,
      token,
      tokenExpiresAt: createDate(new TimeSpan(2, 'h')),
    },
  });
}

export async function getLastEmailVerifications(
  userId: string,
  hours: number = 2
) {
  return await prisma.emailVerification.findMany({
    where: {
      userId,
      tokenExpiresAt: {
        gte: new Date(new Date().getTime() - hours * 60 * 60 * 1000),
      },
    },
    orderBy: {
      tokenExpiresAt: 'desc',
    },
  });
}

export async function deleteEmailVerifications(userId: string) {
  await prisma.emailVerification.deleteMany({
    where: {
      userId,
    },
  });
}

export async function deleteExpiredEmailVerifications(userId: string) {
  await prisma.emailVerification.deleteMany({
    where: {
      userId,
      tokenExpiresAt: {
        lt: new Date(),
      },
    },
  });
}
