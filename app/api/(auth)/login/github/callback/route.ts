import { github, lucia } from '@/auth';
import { cookies } from 'next/headers';
import { OAuth2RequestError } from 'arctic';
import { NextResponse, NextRequest } from 'next/server';
import {
  createUserWithGithub,
  getUserByEmail,
  getUserByGithubId,
} from '@/data-access/users';

export interface GithubUser {
  id: string;
  login: string;
  avatar_url: string;
  email: string;
}

interface Email {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies().get('state')?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new NextResponse(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GithubUser = await githubUserResponse.json();

    const existingUser = await getUserByGithubId(Number(githubUser.id));

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return NextResponse.redirect(new URL('/dashboard'), {
        status: 302,
      });
    }

    if (!githubUser.email) {
      const githubUserEmailResponse = await fetch(
        'https://api.github.com/user/emails',
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );
      const githubUserEmails = await githubUserEmailResponse.json();
      githubUser.email = githubUserEmails.find(
        (email: Email) => email.primary
      )!.email;
    }

    const emailUser = await getUserByEmail(githubUser.email);
    if (emailUser) {
      return NextResponse.redirect(
        new URL(
          `/signin?formError=Account%20already%20signed%20up%20using%20email&email=${githubUser.email}`,
          request.url
        ),
        {
          status: 302,
        }
      );
    } else {
      const user = await createUserWithGithub(githubUser.email, Number(githubUser.id));
      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return NextResponse.redirect(new URL('/dashboard', request.url), {
        status: 302,
      });
    }
  } catch (error) {
    console.error(error);
    if (error instanceof OAuth2RequestError) {
      return new NextResponse(null, {
        status: 400,
      });
    }
    return new NextResponse(null, {
      status: 500,
    });
  }
}
