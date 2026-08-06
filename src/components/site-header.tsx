import Link from "next/link";
import { auth, isGoogleAuthConfigured, signOut } from "@/auth";
import { getContributorAccess } from "@/lib/auth";

export async function SiteHeader() {
  const access = await getContributorAccess();
  const session = isGoogleAuthConfigured() ? await auth() : null;

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-[rgba(247,250,248,0.86)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-teal text-white shadow-[0_8px_20px_var(--glow)] transition group-hover:bg-teal-deep">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path
                fill="currentColor"
                d="M12 2c-3.2 3.8-6 7.2-6 10.4a6 6 0 1 0 12 0C18 9.2 15.2 5.8 12 2zm0 14.2a3.8 3.8 0 0 1-3.8-3.8c0-2 1.6-4.4 3.8-7.1 2.2 2.7 3.8 5.1 3.8 7.1a3.8 3.8 0 0 1-3.8 3.8z"
              />
            </svg>
          </span>
          <span>
            <span className="display block text-lg leading-none text-ink">
              GeoSkills Atlas
            </span>
            <span className="text-xs tracking-wide text-ink-soft">
              Faculty course planning
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm sm:gap-3">
          <Link
            href="/skillsets"
            className="rounded-md px-3 py-2 text-ink-soft transition hover:bg-paper hover:text-ink"
          >
            Skillsets
          </Link>
          <Link
            href="/courses"
            className="rounded-md px-3 py-2 text-ink-soft transition hover:bg-paper hover:text-ink"
          >
            Courses
          </Link>
          {access.allowed ? (
            <>
              <Link
                href="/contribute"
                className="rounded-md bg-teal px-3 py-2 font-medium text-white transition hover:bg-teal-deep"
              >
                Contribute
              </Link>
              <Link
                href="/courses/new"
                className="rounded-md border border-teal px-3 py-2 font-medium text-teal transition hover:bg-teal/5"
              >
                Build course
              </Link>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="rounded-md bg-teal px-3 py-2 font-medium text-white transition hover:bg-teal-deep"
            >
              Sign in with Google
            </Link>
          )}
          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded-md px-3 py-2 text-ink-soft transition hover:bg-paper"
                title={session.user.email ?? undefined}
              >
                Sign out
              </button>
            </form>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
