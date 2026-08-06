import Link from "next/link";
import { isGoogleAuthConfigured, signIn } from "@/auth";
import { SITE_URL } from "@/lib/config";

type PageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export const metadata = {
  title: "Sign in",
};

const ERROR_HELP: Record<string, string> = {
  Configuration:
    "Google OAuth is misconfigured. In Google Cloud, set redirect URI to the value below, and check AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET in Vercel match that client.",
  AccessDenied: "Google denied access. Try another Google account.",
  OAuthAccountNotLinked:
    "This email is already linked differently. Try the same Google account again.",
  OAuthCallback:
    "Google callback failed. Confirm the redirect URI exactly matches the one below (including www).",
  Callback:
    "Login callback failed. Confirm redirect URI and that the site is on https://www.geospatialskills.in.",
  Default: "Sign-in failed. Try again, or check Google OAuth settings.",
};

export default async function SignInPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/contribute";
  const error = params.error;
  const configMissing =
    error === "Config" || !isGoogleAuthConfigured();

  if (configMissing) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <h1 className="display text-4xl text-ink">Configure Google sign-in</h1>
        <p className="mt-4 text-ink-soft">
          Add these Vercel env vars, then redeploy:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-soft">
          <li>
            <code>AUTH_GOOGLE_ID</code>
          </li>
          <li>
            <code>AUTH_GOOGLE_SECRET</code>
          </li>
        </ul>
        <p className="mt-4 text-sm text-ink-soft">
          Google redirect URI:{" "}
          <code>{SITE_URL}/api/auth/callback/google</code>
        </p>
      </div>
    );
  }

  const help =
    (error && (ERROR_HELP[error] || ERROR_HELP.Default)) || null;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-12">
      <h1 className="display text-4xl text-ink">Sign in with Google</h1>
      <p className="mt-3 text-ink-soft">
        Use any Google account to contribute skillsets and build courses.
      </p>

      {help ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-900">
          <p className="font-medium">Sign-in error{error ? `: ${error}` : ""}</p>
          <p className="mt-1">{help}</p>
          <p className="mt-2 break-all text-xs">
            Redirect URI must be exactly:
            <br />
            <code>
              {SITE_URL}/api/auth/callback/google
            </code>
          </p>
        </div>
      ) : null}

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
