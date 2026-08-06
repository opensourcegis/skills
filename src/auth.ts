import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { AUTH_SECRET, SITE_URL } from "@/lib/config";

// Ensure Auth.js uses the public custom domain (not a *.vercel.app deployment URL).
if (!process.env.AUTH_URL) {
  process.env.AUTH_URL = SITE_URL;
}
process.env.AUTH_TRUST_HOST = "true";
process.env.AUTH_SECRET = AUTH_SECRET;

export function isGoogleAuthConfigured() {
  return Boolean(
    process.env.AUTH_GOOGLE_ID?.trim() && process.env.AUTH_GOOGLE_SECRET?.trim(),
  );
}

const providers = [];

if (isGoogleAuthConfigured()) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  trustHost: true,
  secret: AUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      try {
        const target = new URL(url, baseUrl);
        const allowed = new URL(SITE_URL);
        if (target.origin === baseUrl || target.origin === allowed.origin) {
          return target.toString();
        }
      } catch {
        // fall through
      }
      if (url.startsWith("/")) return `${SITE_URL}${url}`;
      return SITE_URL;
    },
  },
});
