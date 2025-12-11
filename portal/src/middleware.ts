import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req: any) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // If no token, redirect to signin (handled by authorized callback)
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Role-based access control
    const userRole = token?.user?.role as string;

    // Admin routes: Admin only
    if (pathname.startsWith('/admin') && userRole !== 'Admin') {
      return NextResponse.redirect(new URL('/auth/signin?error=forbidden', req.url));
    }

    // CAPA routes: QA, Manager, Admin
    if (pathname.startsWith('/capa') && !['QA', 'Manager', 'Admin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/auth/signin?error=forbidden', req.url));
    }

    // DCR routes: Engineer, Manager, Admin
    if (pathname.startsWith('/dcr') && !['Engineer', 'Manager', 'Admin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/auth/signin?error=forbidden', req.url));
    }

    // Dashboard routes: All authenticated users except Production
    if (pathname.startsWith('/dashboard') && !['Engineer', 'QA', 'Manager', 'Admin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/auth/signin?error=forbidden', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/capa/:path*', '/dcr/:path*', '/admin/:path*']
};
