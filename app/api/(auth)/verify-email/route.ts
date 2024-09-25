import { verifyEmailUseCase } from '@/use-cases/users';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url), {
        status: 302,
      });
    }

    const sessionCookie = await verifyEmailUseCase(token);
    if (!sessionCookie) {
      throw new Error('error trying to login');
    }
    
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return NextResponse.redirect(
      new URL('/verification-success', request.url),
      { status: 302 }
    );
  } catch (error) {
    return NextResponse.redirect(new URL('/signin', request.url), {
      status: 302,
    });
  }
}
