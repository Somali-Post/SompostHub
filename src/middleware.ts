import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const LOGIN_PATH = '/login';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('sp_session')?.value;

  if (!token) {
    if (pathname === LOGIN_PATH) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  const session = await verifyToken(token);
  if (!session) {
    if (pathname === LOGIN_PATH) {
      const response = NextResponse.next();
      response.cookies.delete('sp_session');
      return response;
    }
    const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    response.cookies.delete('sp_session');
    return response;
  }

  if (pathname.startsWith('/admin') && session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  if (pathname === LOGIN_PATH) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logos).*)'],
};
