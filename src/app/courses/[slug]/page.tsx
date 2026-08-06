import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  return { title: course ? `${course.code} · ${course.title}` : "Course" };
}

export default async function CourseSheetPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/courses" className="text-sm font-medium text-teal">
        ← Back to courses
      </Link>

      <article className="mt-6 rounded-xl border border-line bg-white/80 p-6 sm:p-10 print:border-0 print:p-0">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">
          Course information sheet
        </p>
        <h1 className="display mt-3 text-4xl text-ink sm:text-5xl">
          {course.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-ink-soft">
          <span className="rounded-md bg-paper px-3 py-1">{course.code}</span>
          <span className="rounded-md bg-paper px-3 py-1">
            {course.skillsets.length} skillsets
          </span>
          <span className="rounded-md bg-paper px-3 py-1">
            by {course.createdByName || course.createdByEmail}
          </span>
        </div>
        <p className="mt-6 text-lg text-ink-soft">{course.summary}</p>
        <p className="mt-3 text-sm text-ink">
          <span className="font-medium">Audience · </span>
          {course.targetAudience}
        </p>

        <section className="mt-10 border-t border-line pt-8">
          <h2 className="display text-2xl">Combined skillsets</h2>
          <ul className="mt-4 space-y-2">
            {course.skillsets.map((skillset) => (
              <li key={skillset.id}>
                <Link
                  href={`/skillsets/${skillset.slug}`}
                  className="text-teal hover:underline"
                >
                  {skillset.title}
                </Link>
                <span className="text-sm text-ink-soft">
                  {" "}
                  · {skillset.topicName} · {skillset.level}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 border-t border-line pt-8">
          <h2 className="display text-2xl">Competencies</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {course.competencies.map((competency) => (
              <li
                key={competency.id}
                className="rounded-lg border border-line px-4 py-3"
              >
                <p className="font-medium">{competency.name}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-teal">
                  {competency.category}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 border-t border-line pt-8">
          <h2 className="display text-2xl">Objectives</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-ink-soft">
            {course.objectives.map((item, index) => (
              <li key={`${item.from}-${index}`}>
                {item.statement}
                <span className="ml-2 text-xs text-teal">({item.from})</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10 border-t border-line pt-8">
          <h2 className="display text-2xl">Outcomes</h2>
          <ul className="mt-4 space-y-3">
            {course.outcomes.map((item, index) => (
              <li
                key={`${item.from}-${index}`}
                className="border-l-2 border-teal/50 pl-4 text-ink-soft"
              >
                {item.statement}
                {item.bloomLevel ? (
                  <span className="ml-2 text-xs uppercase tracking-wide text-teal">
                    {item.bloomLevel}
                  </span>
                ) : null}
                <span className="ml-2 text-xs text-ink-soft/80">
                  ({item.from})
                </span>
              </li>
            ))}
          </ul>
        </section>

        <SessionBlock title="Theory sessions" items={course.theorySessions} />
        <SessionBlock title="Demo sessions" items={course.demoSessions} />
        <SessionBlock
          title="Exercise sessions"
          items={course.exerciseSessions}
        />

        <section className="mt-10 border-t border-line pt-8">
          <h2 className="display text-2xl">Assessment methods</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {course.assessments.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-line px-4 py-3"
              >
                <p className="font-medium text-ink">{item.label}</p>
                <p className="mt-1 text-sm text-ink-soft">{item.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
}

function SessionBlock({
  title,
  items,
}: {
  title: string;
  items: {
    id: string;
    title: string;
    description: string;
    durationMinutes: number | null;
    from: string;
  }[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="mt-10 border-t border-line pt-8">
      <h2 className="display text-2xl">{title}</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <article
            key={`${item.from}-${item.id}`}
            className="rounded-lg border border-line px-4 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-ink">{item.title}</h3>
              <p className="text-xs text-ink-soft">
                {item.from}
                {item.durationMinutes ? ` · ${item.durationMinutes} min` : ""}
              </p>
            </div>
            <p className="mt-2 text-sm text-ink-soft">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
