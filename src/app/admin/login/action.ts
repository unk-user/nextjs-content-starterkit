"use server";
import { getUserByEmail } from "@/data-access/users";
import { ActionResponse } from "@/lib/types";
import { sendOtpUseCase } from "@/use-cases/users";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

export default async function loginAdmin(
  prevState: any,
  formData: FormData,
): Promise<ActionResponse | void> {
  const results = schema.safeParse(Object.fromEntries(formData));
  if (!results.success) return { success: false, error: results.error.message };
  let id: string;

  try {
    const user = await getUserByEmail(results.data.email);
    if (!user) return { success: false, error: "User not found" };
    id = await sendOtpUseCase(results.data.email);
  } catch {
    return {
      success: false,
      error: "Login failed due to an internal server error.",
    };
  }

  return redirect("/admin/login/otp/" + id);
}
