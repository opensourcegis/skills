import { auth, isGoogleAuthConfigured } from "@/auth";

export type Contributor = {
  userId: string;
  email: string;
  name: string | null;
};

export async function requireContributor(): Promise<Contributor> {
  if (!isGoogleAuthConfigured()) {
    throw new Error("AUTH_NOT_CONFIGURED");
  }

  const session = await auth();
  const email = session?.user?.email;
  if (!session?.user || !email) {
    throw new Error("UNAUTHORIZED");
  }

  return {
    userId: session.user.id ?? email,
    email,
    name: session.user.name ?? null,
  };
}

export async function getContributorAccess() {
  if (!isGoogleAuthConfigured()) {
    return {
      signedIn: false,
      allowed: false,
      configured: false,
      email: null as string | null,
    };
  }

  const session = await auth();
  const email = session?.user?.email ?? null;
  if (!session?.user || !email) {
    return { signedIn: false, allowed: false, configured: true, email: null };
  }

  // Any signed-in Google user may contribute.
  return {
    signedIn: true,
    allowed: true,
    configured: true,
    email,
  };
}
