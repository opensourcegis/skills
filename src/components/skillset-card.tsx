import Link from "next/link";

type SkillsetCardProps = {
  skillset: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    level: string;
    estimatedHours: number | null;
    topicName: string;
    topicSlug: string;
    competencies: { id: string; name: string; slug: string }[];
    outcomes: { id: string; statement: string }[];
  };
  view?: "card" | "list";
};

export function SkillsetCard({ skillset, view = "card" }: SkillsetCardProps) {
  if (view === "list") {
    return (
      <Link
        href={`/skillsets/${skillset.slug}`}
        className="group grid gap-3 border-b border-line py-5 transition hover:bg-paper/70 sm:grid-cols-[1.4fr_1fr_auto] sm:items-start"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">
            {skillset.topicName}
          </p>
          <h3 className="display mt-1 text-xl text-ink transition group-hover:text-teal-deep">
            {skillset.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            {skillset.summary}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {skillset.competencies.slice(0, 4).map((competency) => (
            <span
              key={competency.id}
              className="rounded-md bg-paper-deep px-2.5 py-1 text-xs text-ink-soft"
            >
              {competency.name}
            </span>
          ))}
        </div>
        <div className="text-right text-xs text-ink-soft">
          <p className="capitalize">{skillset.level}</p>
          {skillset.estimatedHours ? (
            <p className="mt-1">{skillset.estimatedHours}h</p>
          ) : null}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/skillsets/${skillset.slug}`}
      className="group flex h-full flex-col border-t-2 border-teal/40 bg-white/70 p-6 shadow-[0_18px_40px_rgba(20,33,43,0.05)] transition duration-300 hover:-translate-y-1 hover:border-teal hover:shadow-[0_24px_50px_rgba(15,107,99,0.12)]"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">
          {skillset.topicName}
        </p>
        <span className="rounded-md bg-paper px-2 py-1 text-xs capitalize text-ink-soft">
          {skillset.level}
        </span>
      </div>
      <h3 className="display mt-3 text-2xl leading-snug text-ink transition group-hover:text-teal-deep">
        {skillset.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
        {skillset.summary}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {skillset.competencies.slice(0, 3).map((competency) => (
          <span
            key={competency.id}
            className="rounded-md bg-paper-deep px-2.5 py-1 text-xs text-ink-soft"
          >
            {competency.name}
          </span>
        ))}
      </div>
      {skillset.outcomes[0] ? (
        <p className="mt-5 border-t border-line pt-4 text-sm text-ink">
          <span className="font-medium text-teal">Outcome · </span>
          {skillset.outcomes[0].statement}
        </p>
      ) : null}
    </Link>
  );
}
