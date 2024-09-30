import prisma from "@/lib/db";
import { User, OneTimePassword } from "@prisma/client";

export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { email } });
}

export async function getOtpByIdClient(
  id: string,
): Promise<{
  email: string;
  expiresAt: Date;
  id: string;
  attempts: number;
} | null> {
  return await prisma.oneTimePassword.findUnique({
    where: { id },
    select: { email: true, expiresAt: true, id: true, attempts: true },
  });
}
