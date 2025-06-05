import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove: (name, options) => {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired & still valid
  await supabase.auth.getSession();

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if the request is for a protected route
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/portfolio') ||
    req.nextUrl.pathname.startsWith('/market') ||
    req.nextUrl.pathname.startsWith('/profile');

  // If accessing a protected route without a session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/signin', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If accessing auth pages with a session, redirect to dashboard
  if ((req.nextUrl.pathname.startsWith('/auth/signin') ||
    req.nextUrl.pathname.startsWith('/auth/signup')) &&
    session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/portfolio/:path*',
    '/market/:path*',
    '/profile/:path*',
    '/auth/signin',
    '/auth/signup',
  ],
};
