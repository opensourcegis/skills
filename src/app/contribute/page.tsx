import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { SkillsetForm } from "@/components/skillset-form";
import { SetupBanner } from "@/components/setup-banner";
import { getContributorAccess } from "@/lib/auth";
import { isClerkConfigured } from "@/lib/clerk-config";
import {
  databaseReady,
  listCompetencies,
  listTopics,
} from "@/lib/queries";

export const metadata = {
  title: "Contribute a skillset",
};

export default async function ContributePage() {
  const ready = await databaseReady();
  const clerkReady = isClerkConfigured();

  if (!ready || !clerkReady) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="display text-4xl text-ink">Contribute</h1>
        <div className="mt-8">
          <SetupBanner />
        </div>
      </div>
    );
  }

  const access = await getContributorAccess();

  if (!access.signedIn) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <h1 className="display text-4xl text-ink">Faculty sign in</h1>
        <p className="mt-4 text-ink-soft">
          Allowed faculty emails can add skillsets, competencies, objectives,
          outcomes, and exercises.
        </p>
        <div className="mt-8">
          <SignInButton mode="modal">
            <button className="rounded-md bg-teal px-5 py-3 font-medium text-white hover:bg-teal-deep">
              Sign in to contribute
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  if (!access.allowed) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <h1 className="display text-4xl text-ink">Access restricted</h1>
        <p className="mt-4 text-ink-soft">
          Signed in as <strong>{access.email}</strong>, but this address is not
          on the faculty allowlist. Ask an admin to add it to{" "}
          <code>ALLOWED_EMAILS</code>.
        </p>
        <Link href="/skillsets" className="mt-8 inline-block text-teal">
          Browse the catalog
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
        Capture the skill, choose competencies, and frame objectives, outcomes,
        and classroom exercises.
      </p>
      <div className="mt-8">
        <SkillsetForm topics={topics} competencies={competencies} />
      </div>
    </div>
  );
}
