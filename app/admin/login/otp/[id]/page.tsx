import { OtpInput } from "./otp-input";
import { notFound } from "next/navigation";

import prisma from "@/lib/db";

export default async function OtpPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const otp = await prisma.oneTimePassword.findUnique({
    where: { id },
    select: { email: true, expiresAt: true, id: true },
  });

  if (!otp) return notFound();

  return (
    <section className="grid flex-1 place-items-center">
      <OtpInput otp={otp} />
    </section>
  );
}
