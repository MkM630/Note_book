import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/notes'];
const authRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (session) {
    if (isAuthRoute || pathname === '/') {
      return NextResponse.redirect(new URL('/notes', request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
