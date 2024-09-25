'use server';

import { registerUserUseCase } from '@/use-cases/users';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .max(255),
});

export interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string | null;
  success?: boolean;
  email?: string;
}

export async function signup(
  _: any,
  formData: FormData
): Promise<ActionResponse<z.infer<typeof signupSchema>>> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = signupSchema.safeParse(obj);
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
    const { user } = await registerUserUseCase(
      parsed.data.email,
      parsed.data.password
    );

    return {
      success: true,
      email: user.email,
    };
  } catch (error) {
    return {
      formError: (error as Error).message,
    };
  }
}
