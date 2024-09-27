import prisma from "@/lib/db";
import { User, OneTimePassword } from "@prisma/client";

export async function getUserByEmail(email: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { email } });
}