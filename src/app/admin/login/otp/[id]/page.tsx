import { OtpInput } from "./otp-input";
import { notFound } from "next/navigation";

import prisma from "@/lib/db";
import { getOtpByIdClient } from "@/data-access/users";

export default async function OtpPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const otp = await getOtpByIdClient(id);

  if (!otp) return notFound();

  return (
    <section className="grid flex-1 place-items-center px-2">
      <OtpInput
        otpId={id}
        email={otp.email}
        expiresAt={otp.expiresAt}
        attempts={otp.attempts}
      />
    </section>
  );
}
