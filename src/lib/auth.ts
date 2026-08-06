import { auth, currentUser } from "@clerk/nextjs/server";
import { isEmailAllowed } from "./utils";

export type Contributor = {
  userId: string;
  email: string;
  name: string | null;
};

export async function requireContributor(): Promise<Contributor> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress;

  if (!email || !isEmailAllowed(email)) {
    throw new Error("FORBIDDEN");
  }

  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    null;

  return { userId, email, name };
}

export async function getContributorAccess() {
  const { userId } = await auth();
  if (!userId) {
    return { signedIn: false, allowed: false, email: null as string | null };
  }

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    null;

  return {
    signedIn: true,
    allowed: isEmailAllowed(email),
    email,
  };
}
