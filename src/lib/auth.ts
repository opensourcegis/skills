import { auth, isGoogleAuthConfigured } from "@/auth";
import { isEmailAllowed } from "@/lib/utils";

export type Contributor = {
  userId: string;
  email: string;
  name: string | null;
};

export async function requireContributor(): Promise<Contributor> {
  if (!isGoogleAuthConfigured()) {
    throw new Error("UNAUTHORIZED");
  }

  const session = await auth();
  const email = session?.user?.email;
  if (!session?.user || !email) {
    throw new Error("UNAUTHORIZED");
  }
  if (!isEmailAllowed(email)) {
    throw new Error("FORBIDDEN");
  }

  return {
    userId: session.user.id ?? email,
    email,
    name: session.user.name ?? null,
  };
}

export async function getContributorAccess() {
  if (!isGoogleAuthConfigured()) {
    return { signedIn: false, allowed: false, email: null as string | null };
  }

  const session = await auth();
  const email = session?.user?.email ?? null;
  if (!session?.user || !email) {
    return { signedIn: false, allowed: false, email: null };
  }

  return {
    signedIn: true,
    allowed: isEmailAllowed(email),
    email,
  };
}
