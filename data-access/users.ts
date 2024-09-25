import crypto from 'node:crypto';
import prisma from '@/lib/db';
import { type User } from '@prisma/client';

export async function hashPassword(plainTextPassword: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(
      plainTextPassword,
      salt,
      10000,
      64,
      'sha512',
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      }
    );
  });
}

export async function getUser(id: string) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}
export async function getUserByGithubId(githubId: number) {
  return await prisma.user.findUnique({
    where: {
      githubId,
    },
  });
}

export async function updatePassword(userId: string, password: string) {
  const salt = crypto.randomBytes(128).toString('base64');
  const hash = await hashPassword(password, salt);
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hash,
      salt,
    },
  });
}

export async function createUserWithPassword(
  email: string,
  password: string,
  emailVerified: boolean = false
) {
  const salt = crypto.randomBytes(128).toString('base64');
  const hash = await hashPassword(password, salt);

  return await prisma.user.create({
    data: {
      email,
      emailVerified,
      password: hash,
      salt,
    },
  });
}

export async function createUserWithGithub(email: string, githubId: number) {
  return await prisma.user.create({
    data: {
      email,
      githubId,
      emailVerified: true,
    },
  });
}

export async function updateUser(id: string, data: Partial<User>) {
  return await prisma.user.update({
    where: {
      id,
    },
    data,
  });
}

export async function verifyUser(id: string) {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      emailVerified: true,
    },
  });
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: {
      id,
    },
  });
}
