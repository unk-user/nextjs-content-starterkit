"use server";
import { generateRandomString, alphabet } from "oslo/crypto";
import { sendOTPEmail } from "@/emails/otp-email";
import { TimeSpan, createDate } from "oslo";
import { User } from "@prisma/client";

import bcrypt from "bcrypt";
import prisma from "@/lib/db";

export async function sendOtpUseCase(email: string): Promise<string> {
  await prisma.oneTimePassword.deleteMany({ where: { email } });
  const code = generateRandomString(8, alphabet("0-9"));
  const salt = await bcrypt.genSalt();
  const hashedCode = await bcrypt.hash(code, salt);

  const { id } = await prisma.oneTimePassword.create({
    data: {
      email,
      code: hashedCode,
      expiresAt: createDate(new TimeSpan(15, "m")),
    },
  });
  await sendOTPEmail(email, code);
  return id;
}

export async function loginOtpUseCase(id: string, code: string): Promise<User> {
  const otp = await prisma.oneTimePassword.findUnique({
    where: { id, expiresAt: { gt: new Date() } },
  });
  if (!otp) throw new Error("The code is expired. Please request a new one!");

  const isValid = await bcrypt.compare(code, otp.code);
  if (!isValid) throw new Error("The code wasn't valid. Give it another try!");

  await prisma.oneTimePassword.delete({ where: { id } });
  const user = await prisma.user.findUnique({ where: { email: otp.email } });
  if (!user) throw new Error("Unfortunately we couldn't find your account.");

  return user;
}
