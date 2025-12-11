import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { createUser, logAuthEvent } from './auth';

// CRITICAL: Enforce Google OAuth configuration
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('FATAL: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured');
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Log sign-in attempt
      console.log('[AUTH] Sign-in attempt:', {
        email: user.email,
        provider: account?.provider,
        timestamp: new Date().toISOString()
      });

      // PRODUCTION: Domain-based allowlist for medical device access
      const allowedDomains = (process.env.ALLOWED_DOMAINS || 'lwscientific.com').split(',');
      const userDomain = user.email?.split('@')[1];
      
      if (!userDomain || !allowedDomains.includes(userDomain)) {
        console.log('[AUTH] Sign-in denied - unauthorized domain:', userDomain);
        return false;
      }
      
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Create user with role-based permissions
        const qmsUser = createUser(user.email || '', user.name || '');
        token.user = qmsUser;

        // Log successful authentication
        logAuthEvent('JWT_CREATED', qmsUser, { provider: account?.provider });
      }
      // Preserve access token from OAuth provider
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as any;

        // Log session creation
        logAuthEvent('SESSION_CREATED', token.user as any);
      }
      // Expose access token to client-side session
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  events: {
    async signOut({ token }) {
      if (token?.user) {
        logAuthEvent('SIGN_OUT', token.user as any);
      }
    },
  },
};