'use server';

import { z } from 'zod';
import { ActionResponse } from '../signup/action';
import { loginUserUseCase } from '@/use-cases/users';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const signinSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .max(255),
});

export async function signin(
  _: any,
  formData: FormData
): Promise<ActionResponse<z.infer<typeof signinSchema>>> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = signinSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        email: err.fieldErrors.email?.[0],
        password: err.fieldErrors.password?.[0],
      },
    };
  }

  try {
    const sessionCookie = await loginUserUseCase(
      parsed.data.email,
      parsed.data.password
    );

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    redirect('/dashboard')
  } catch (error) {
    return {
      formError: (error as Error).message,
    };
  }

}
