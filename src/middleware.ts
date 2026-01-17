import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sp_session')?.value;
  const path = req.nextUrl.pathname;

  if (!token && path !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token) {
    const payload = await verifyToken(token);

    if (!payload) {
      if (path === '/login') {
        const response = NextResponse.next();
        response.cookies.delete('sp_session');
        return response;
      }

      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('sp_session');
      return response;
    }

    if (path.startsWith('/admin') && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/chat', req.url));
    }

    if (path === '/login') {
      return NextResponse.redirect(new URL('/chat', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logos).*)',
  ],
};
