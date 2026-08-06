import { Suspense } from "react";
import { SkillsetCard } from "@/components/skillset-card";
import { SkillsetFilters } from "@/components/skillset-filters";
import { LEVELS } from "@/lib/utils";
import { getCatalogMeta, listSkillsets } from "@/lib/queries";

type PageProps = {
  searchParams: Promise<{
    q?: string;
    topic?: string;
    competency?: string;
    outcome?: string;
    level?: string;
    view?: string;
  }>;
};

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Browse skillsets",
};

export default async function SkillsetsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [meta, skillsets] = await Promise.all([
    getCatalogMeta(),
    listSkillsets({
      q: params.q,
      topic: params.topic,
      competency: params.competency,
      outcome: params.outcome,
      level: params.level,
    }),
  ]);

  const view = params.view === "list" ? "list" : "card";

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <h1 className="display text-4xl text-ink">Skillset catalog</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Filter by topic, competency, level, or outcome keywords. Switch
          between card and list views for planning sessions.
        </p>
      </div>

      <Suspense fallback={<div className="h-40 rounded-xl bg-white/50" />}>
        <SkillsetFilters
          topics={meta.topics}
          competencies={meta.competencies}
          levels={[...LEVELS]}
        />
      </Suspense>

      <p className="mt-6 text-sm text-ink-soft">
        {skillsets.length} skillset{skillsets.length === 1 ? "" : "s"}
      </p>

      {skillsets.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-line bg-white/60 px-5 py-10 text-ink-soft">
          No skillsets match these filters.
        </p>
      ) : view === "list" ? (
        <div className="mt-4 divide-y-0 rounded-xl border border-line bg-white/70 px-5">
          {skillsets.map((skillset) => (
            <SkillsetCard key={skillset.id} skillset={skillset} view="list" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {skillsets.map((skillset) => (
            <SkillsetCard key={skillset.id} skillset={skillset} />
          ))}
        </div>
      )}
    </div>
  );
}
