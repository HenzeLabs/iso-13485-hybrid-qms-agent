import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default withAuth(
  function middleware(req: NextRequest) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Role-based access control
    const userRole = token?.user?.role as string;
    
    if (pathname.startsWith('/admin') && userRole !== 'Admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    
    if (pathname.startsWith('/capa') && !['QA', 'Manager', 'Admin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    
    if (pathname.startsWith('/dcr') && !['Engineer', 'Manager', 'Admin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    
    if (pathname.startsWith('/dashboard') && !['Engineer', 'QA', 'Manager', 'Admin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/capa/:path*', '/dcr/:path*', '/admin/:path*']
};