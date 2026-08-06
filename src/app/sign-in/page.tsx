import Link from "next/link";
import { isGoogleAuthConfigured, signIn } from "@/auth";
import { SetupBanner } from "@/components/setup-banner";

type PageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export const metadata = {
  title: "Faculty sign in",
};

export default async function SignInPage({ searchParams }: PageProps) {
  const params = await searchParams;

  if (!isGoogleAuthConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="display text-4xl text-ink">Faculty sign in</h1>
        <div className="mt-8">
          <SetupBanner />
        </div>
      </div>
    );
  }

  const callbackUrl = params.callbackUrl || "/contribute";
  const denied = params.error === "AccessDenied";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-12">
      <h1 className="display text-4xl text-ink">Faculty sign in</h1>
      <p className="mt-3 text-ink-soft">
        Use your Google account. Only allowlisted faculty emails can access
        contribution tools.
      </p>

      {denied ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          That Google account is not on the faculty allowlist. Ask an admin to
          add your email to <code>ALLOWED_EMAILS</code>.
        </p>
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
          <GoogleMark />
          Continue with Google
        </button>
      </form>

      <Link href="/" className="mt-6 text-sm text-teal">
        ← Back to home
      </Link>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.4c-.3 1.4-1.1 2.6-2.3 3.4v2.8h3.7c2.2-2 3.4-5 3.4-8.3z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.8-2.9l-3.7-2.8c-1 .7-2.4 1.1-4.1 1.1-3.2 0-5.9-2.1-6.8-5H1.4v2.9C3.3 21.3 7.3 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.2 14.4c-.2-.7-.4-1.4-.4-2.4s.1-1.7.4-2.4V6.7H1.4C.5 8.4 0 10.1 0 12s.5 3.6 1.4 5.3l3.8-2.9z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.4 6.7l3.8 2.9c.9-2.9 3.6-4.8 6.8-4.8z"
      />
    </svg>
  );
}
