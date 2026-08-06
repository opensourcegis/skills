import { notFound, redirect } from "next/navigation";
import { SkillsetForm } from "@/components/skillset-form";
import { getContributorAccess } from "@/lib/auth";
import {
  getSkillsetBySlug,
  listCompetencies,
  listTopics,
} from "@/lib/queries";
import type { AssessmentStrategyId, BloomLevel, Level, SessionKind } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `Edit ${slug}` };
}

export default async function EditSkillsetPage({ params }: PageProps) {
  const { slug } = await params;
  const access = await getContributorAccess();
  if (!access.signedIn) {
    redirect(`/sign-in?callbackUrl=/skillsets/${slug}/edit`);
  }

  const [skillset, topics, competencies] = await Promise.all([
    getSkillsetBySlug(slug),
    listTopics(),
    listCompetencies(),
  ]);

  if (!skillset) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="display text-4xl text-ink">Edit skillset</h1>
      <p className="mt-3 text-ink-soft">{skillset.title}</p>
      <div className="mt-8">
        <SkillsetForm
          mode="edit"
          topics={topics}
          competencies={competencies}
          initial={{
            id: skillset.id,
            title: skillset.title,
            summary: skillset.summary,
            description: skillset.description,
            topicId: skillset.topicId,
            level: skillset.level as Level,
            estimatedHours: skillset.estimatedHours,
            competencyIds: skillset.competencies.map((item) => item.id),
            newCompetencies: [],
            objectives: skillset.objectives.map((item) => item.statement),
            outcomes: skillset.outcomes.map((item) => ({
              statement: item.statement,
              bloomLevel: (item.bloomLevel as BloomLevel) || "apply",
            })),
            sessions: skillset.sessions.map((item) => ({
              kind: item.kind as SessionKind,
              title: item.title,
              description: item.description,
              durationMinutes: item.durationMinutes,
            })),
            assessmentStrategyIds:
              skillset.assessmentStrategyIds as AssessmentStrategyId[],
          }}
        />
      </div>
    </div>
  );
}
