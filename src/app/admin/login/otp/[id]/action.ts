"use server";
import { lucia } from "@/auth";
import { ActionResponse } from "@/lib/types";
import { loginOtpUseCase } from "@/use-cases/users";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function validateOtp(
  id: string,
  code: string,
): Promise<ActionResponse | void> {
  try {
    const user = await loginOtpUseCase(id, code);

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
  } catch (e: any) {
    return { success: false, error: e?.message || "Internal server error" };
  }
  redirect("/admin");
}
