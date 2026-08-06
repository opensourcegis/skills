import Link from "next/link";
import { isGoogleAuthConfigured, signIn } from "@/auth";

type PageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export const metadata = {
  title: "Sign in",
};

export default async function SignInPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/contribute";
  const configMissing =
    params.error === "Config" || !isGoogleAuthConfigured();

  if (configMissing) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <h1 className="display text-4xl text-ink">Configure Google sign-in</h1>
        <p className="mt-4 text-ink-soft">
          Add these Vercel env vars, then redeploy:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-soft">
          <li>
            <code>AUTH_SECRET</code>
          </li>
          <li>
            <code>AUTH_GOOGLE_ID</code>
          </li>
          <li>
            <code>AUTH_GOOGLE_SECRET</code>
          </li>
        </ul>
        <p className="mt-4 text-sm text-ink-soft">
          Redirect URI:{" "}
          <code>https://YOUR-DOMAIN/api/auth/callback/google</code>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-12">
      <h1 className="display text-4xl text-ink">Sign in with Google</h1>
      <p className="mt-3 text-ink-soft">
        Use any Google account to contribute skillsets and build courses.
      </p>
      <form
        className="mt-8"
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: callbackUrl });
        }}
      >
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-md border border-line bg-white px-5 py-3 font-medium text-ink shadow-sm transition hover:bg-paper"
        >
          Continue with Google
        </button>
      </form>
      <Link href="/" className="mt-6 text-sm text-teal">
        ← Back to home
      </Link>
    </div>
  );
}
