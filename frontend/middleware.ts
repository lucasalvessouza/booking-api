import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  console.log(req.cookies);
  const token = req.cookies.get('token')?.value;
  if (!token && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/profile/:path*'],
};
