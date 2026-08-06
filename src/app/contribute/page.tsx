import Link from "next/link";
import { getContributorAccess } from "@/lib/auth";
import { SkillsetForm } from "@/components/skillset-form";
import { listCompetencies, listTopics } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contribute a skillset",
};

export default async function ContributePage() {
  const access = await getContributorAccess();

  if (!access.configured) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <h1 className="display text-4xl text-ink">Google sign-in required</h1>
        <p className="mt-4 text-ink-soft">
          Set <code>AUTH_GOOGLE_ID</code> and{" "}
          <code>AUTH_GOOGLE_SECRET</code> in Vercel environment variables to
          enable contribution.
        </p>
      </div>
    );
  }

  if (!access.signedIn) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <h1 className="display text-4xl text-ink">Sign in with Google</h1>
        <p className="mt-4 text-ink-soft">
          Sign in with your Google account to add or edit skillsets and courses.
        </p>
        <Link
          href="/sign-in?callbackUrl=/contribute"
          className="mt-8 inline-flex rounded-md bg-teal px-5 py-3 font-medium text-white hover:bg-teal-deep"
        >
          Continue with Google
        </Link>
      </div>
    );
  }

  const [topics, competencies] = await Promise.all([
    listTopics(),
    listCompetencies(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="display text-4xl text-ink">Contribute a skillset</h1>
      <p className="mt-3 text-ink-soft">
        Signed in as {access.email}. Add competencies, theory/demo/exercise
        sessions, and assessment methods.
      </p>
      <div className="mt-8">
        <SkillsetForm topics={topics} competencies={competencies} />
      </div>
    </div>
  );
}
