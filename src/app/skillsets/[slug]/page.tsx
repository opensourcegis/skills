import Link from "next/link";
import { notFound } from "next/navigation";
import { getSkillsetBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const skillset = await getSkillsetBySlug(slug);
  return { title: skillset?.title ?? "Skillset" };
}

export default async function SkillsetDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const skillset = await getSkillsetBySlug(slug);
  if (!skillset) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/skillsets" className="text-sm font-medium text-teal">
        ← Back to catalog
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">
            {skillset.topicName}
          </p>
          <h1 className="display mt-2 text-4xl text-ink sm:text-5xl">
            {skillset.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            {skillset.summary}
          </p>
        </div>
        <Link
          href={`/skillsets/${skillset.slug}/edit`}
          className="rounded-md bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-deep"
        >
          Edit
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-sm text-ink-soft">
        <span className="rounded-md bg-paper px-3 py-1 capitalize">
          {skillset.level}
        </span>
        {skillset.estimatedHours ? (
          <span className="rounded-md bg-paper px-3 py-1">
            ~{skillset.estimatedHours} hours
          </span>
        ) : null}
        <span className="rounded-md bg-paper px-3 py-1">
          by {skillset.createdByName || skillset.createdByEmail}
        </span>
      </div>

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="display text-2xl">For faculty</h2>
        <p className="mt-3 whitespace-pre-wrap leading-relaxed text-ink-soft">
          {skillset.description}
        </p>
      </section>

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="display text-2xl">Competencies</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {skillset.competencies.map((competency) => (
            <li
              key={competency.id}
              className="rounded-lg border border-line bg-white/70 px-4 py-3"
            >
              <p className="font-medium text-ink">{competency.name}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-teal">
                {competency.category}
              </p>
              {competency.description ? (
                <p className="mt-2 text-sm text-ink-soft">
                  {competency.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="display text-2xl">Objectives</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-ink-soft">
          {skillset.objectives.map((objective) => (
            <li key={objective.id}>{objective.statement}</li>
          ))}
        </ol>
      </section>

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="display text-2xl">Outcomes</h2>
        <ul className="mt-4 space-y-3">
          {skillset.outcomes.map((outcome) => (
            <li
              key={outcome.id}
              className="border-l-2 border-teal/50 pl-4 text-ink-soft"
            >
              {outcome.statement}
              {outcome.bloomLevel ? (
                <span className="ml-2 text-xs uppercase tracking-wide text-teal">
                  {outcome.bloomLevel}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 border-t border-line pt-8">
        <h2 className="display text-2xl">Exercises</h2>
        <div className="mt-4 grid gap-4">
          {skillset.exercises.map((exercise) => (
            <article
              key={exercise.id}
              className="rounded-lg border border-line bg-white/70 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-ink">{exercise.title}</h3>
                <p className="text-xs uppercase tracking-wide text-ink-soft">
                  {exercise.exerciseType}
                  {exercise.durationMinutes
                    ? ` · ${exercise.durationMinutes} min`
                    : ""}
                </p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {exercise.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
