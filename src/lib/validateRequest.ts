'use server';

import { lucia } from '@/auth';
import { User, Session } from '@prisma/client';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const uncachedValidateRequest = async (): Promise<
  { user: Partial<User>; session: Session } | { user: null; session: null }
> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session && result.session.fresh) {
      console.log(result.session);

      const sessionCookie = lucia.createSessionCookie(result.session.id);
      console.log(sessionCookie)
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {
  }

  return result;
};

export const validateRequest = cache(uncachedValidateRequest);
