import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      permissions?: string[];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    user?: {
      email: string;
      name: string;
      role: string;
      permissions: string[];
    };
  }
}
