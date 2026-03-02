import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /bet/* routes, excluding auth pages
  if (pathname.startsWith('/bet/login') || pathname.startsWith('/bet/register')) {
    return NextResponse.next();
  }

  // Check for better-auth session cookie
  const sessionToken =
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__Secure-better-auth.session_token')?.value;

  if (!sessionToken) {
    const loginUrl = new URL('/bet/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/bet/:path*'],
};
