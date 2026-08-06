import { SkillsetForm } from "@/components/skillset-form";
import { listCompetencies, listTopics } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contribute a skillset",
};

export default async function ContributePage() {
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
