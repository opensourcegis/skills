"use client";

import { useRouter } from "next/navigation";
import { startTransition, useMemo, useState } from "react";
import { createCourse } from "@/lib/actions";

type SkillsetOption = {
  id: string;
  title: string;
  summary: string;
  level: string;
  topicName: string;
};

export function CourseBuilderForm({
  skillsets,
}: {
  skillsets: SkillsetOption[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [summary, setSummary] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [skillsetIds, setSkillsetIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selected = useMemo(
    () => skillsets.filter((item) => skillsetIds.includes(item.id)),
    [skillsets, skillsetIds],
  );

  function toggle(id: string) {
    setSkillsetIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const result = await createCourse({
      title,
      code,
      summary,
      targetAudience,
      skillsetIds,
    });
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    startTransition(() => {
      router.push(`/courses/${result.slug}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8">
      <section className="grid gap-4 border-t border-line pt-6">
        <h2 className="display text-2xl">Course details</h2>
        <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Course title</span>
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-md border border-line bg-white px-3 py-2"
              placeholder="e.g. Applied Geospatial Methods"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Course code</span>
            <input
              required
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="rounded-md border border-line bg-white px-3 py-2"
              placeholder="GEO-301"
            />
          </label>
        </div>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Summary</span>
          <textarea
            required
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            rows={3}
            className="rounded-md border border-line bg-white px-3 py-2"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Target audience</span>
          <input
            required
            value={targetAudience}
            onChange={(event) => setTargetAudience(event.target.value)}
            className="rounded-md border border-line bg-white px-3 py-2"
            placeholder="Undergraduate GIS majors, semester 5"
          />
        </label>
      </section>

      <section className="grid gap-4 border-t border-line pt-6">
        <h2 className="display text-2xl">Combine skillsets</h2>
        <p className="text-sm text-ink-soft">
          Select at least two skillsets. Their objectives, outcomes,
          competencies, sessions, and assessments will merge into one course
          information sheet.
        </p>
        <div className="grid gap-3">
          {skillsets.map((skillset) => {
            const checked = skillsetIds.includes(skillset.id);
            return (
              <label
                key={skillset.id}
                className={`flex cursor-pointer gap-3 rounded-lg border px-4 py-3 transition ${
                  checked
                    ? "border-teal bg-teal/5"
                    : "border-line bg-white hover:border-teal/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(skillset.id)}
                  className="mt-1"
                />
                <span>
                  <span className="block font-medium text-ink">
                    {skillset.title}
                  </span>
                  <span className="mt-1 block text-xs uppercase tracking-wide text-teal">
                    {skillset.topicName} · {skillset.level}
                  </span>
                  <span className="mt-1 block text-sm text-ink-soft">
                    {skillset.summary}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        {selected.length > 0 ? (
          <p className="text-sm text-ink-soft">
            Selected: {selected.map((item) => item.title).join(" · ")}
          </p>
        ) : null}
      </section>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={saving || skillsetIds.length < 2}
        className="justify-self-start rounded-md bg-teal px-5 py-3 font-medium text-white transition hover:bg-teal-deep disabled:opacity-60"
      >
        {saving ? "Creating…" : "Create course information sheet"}
      </button>
    </form>
  );
}
