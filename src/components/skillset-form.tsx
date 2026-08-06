"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { createSkillset, updateSkillset } from "@/lib/actions";
import {
  ASSESSMENT_STRATEGIES,
  BLOOM_LEVELS,
  LEVELS,
  SESSION_KINDS,
  type AssessmentStrategyId,
  type BloomLevel,
  type Level,
  type SessionKind,
} from "@/lib/utils";
import type { SkillsetFormValues } from "@/lib/validators";

type Option = { id: string; name: string };

type SkillsetFormProps = {
  topics: Option[];
  competencies: Option[];
  initial?: Partial<SkillsetFormValues> & { id?: string };
  mode?: "create" | "edit";
};

type DraftSession = {
  kind: SessionKind;
  title: string;
  description: string;
  durationMinutes: number | null;
};

type DraftCompetency = {
  name: string;
  category: string;
  description: string;
};

const emptySession = (kind: SessionKind = "exercise"): DraftSession => ({
  kind,
  title: "",
  description: "",
  durationMinutes: 60,
});

export function SkillsetForm({
  topics,
  competencies,
  initial,
  mode = "create",
}: SkillsetFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [topicId, setTopicId] = useState(initial?.topicId ?? topics[0]?.id ?? "");
  const [level, setLevel] = useState<Level>(initial?.level ?? "intermediate");
  const [estimatedHours, setEstimatedHours] = useState<number | null>(
    initial?.estimatedHours ?? 12,
  );
  const [competencyIds, setCompetencyIds] = useState<string[]>(
    initial?.competencyIds ?? [],
  );
  const [newCompetencies, setNewCompetencies] = useState<DraftCompetency[]>([]);
  const [objectives, setObjectives] = useState<string[]>(
    initial?.objectives ?? [""],
  );
  const [outcomes, setOutcomes] = useState(
    initial?.outcomes ?? [{ statement: "", bloomLevel: "apply" as BloomLevel }],
  );
  const [sessions, setSessions] = useState<DraftSession[]>(
    initial?.sessions?.length
      ? initial.sessions.map((item) => ({
          kind: item.kind,
          title: item.title,
          description: item.description,
          durationMinutes: item.durationMinutes ?? null,
        }))
      : [
          emptySession("theory"),
          emptySession("demo"),
          emptySession("exercise"),
        ],
  );
  const [assessmentStrategyIds, setAssessmentStrategyIds] = useState<
    AssessmentStrategyId[]
  >(initial?.assessmentStrategyIds ?? ["practical_lab_test"]);

  function toggleCompetency(id: string) {
    setCompetencyIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function toggleAssessment(id: AssessmentStrategyId) {
    setAssessmentStrategyIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload: SkillsetFormValues = {
      title,
      summary,
      description,
      topicId,
      level,
      estimatedHours,
      competencyIds,
      newCompetencies: newCompetencies.filter((item) => item.name.trim()),
      objectives: objectives.filter(Boolean),
      outcomes: outcomes.filter((item) => item.statement.trim()),
      sessions: sessions.filter(
        (item) => item.title.trim() && item.description.trim(),
      ),
      assessmentStrategyIds,
    };

    const result =
      mode === "edit" && initial?.id
        ? await updateSkillset(initial.id, payload)
        : await createSkillset(payload);

    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    startTransition(() => {
      router.push(`/skillsets/${result.slug}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8">
      <section className="grid gap-4 border-t border-line pt-6">
        <h2 className="display text-2xl text-ink">Skill overview</h2>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Title</span>
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded-md border border-line bg-white px-3 py-2"
          />
        </label>
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
          <span className="font-medium">Description for faculty</span>
          <textarea
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            className="rounded-md border border-line bg-white px-3 py-2"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Topic</span>
            <select
              required
              value={topicId}
              onChange={(event) => setTopicId(event.target.value)}
              className="rounded-md border border-line bg-white px-3 py-2"
            >
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Level</span>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value as Level)}
              className="rounded-md border border-line bg-white px-3 py-2"
            >
              {LEVELS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Estimated hours</span>
            <input
              type="number"
              min={1}
              max={200}
              value={estimatedHours ?? ""}
              onChange={(event) =>
                setEstimatedHours(
                  event.target.value ? Number(event.target.value) : null,
                )
              }
              className="rounded-md border border-line bg-white px-3 py-2"
            />
          </label>
        </div>
      </section>

      <section className="grid gap-4 border-t border-line pt-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="display text-2xl text-ink">Competencies</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Tick existing competencies or add new ones for this skillset.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setNewCompetencies((current) => [
                ...current,
                { name: "", category: "Custom", description: "" },
              ])
            }
            className="rounded-md bg-paper px-3 py-1.5 text-sm text-ink-soft"
          >
            Add new competency
          </button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {competencies.map((competency) => {
            const checked = competencyIds.includes(competency.id);
            return (
              <label
                key={competency.id}
                className={`flex cursor-pointer items-start gap-3 rounded-md border px-3 py-3 text-sm transition ${
                  checked
                    ? "border-teal bg-teal/5"
                    : "border-line bg-white hover:border-teal/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCompetency(competency.id)}
                  className="mt-1"
                />
                <span>{competency.name}</span>
              </label>
            );
          })}
        </div>
        {newCompetencies.map((competency, index) => (
          <div
            key={`new-comp-${index}`}
            className="grid gap-2 rounded-lg border border-dashed border-teal/40 bg-white/80 p-4 sm:grid-cols-3"
          >
            <input
              value={competency.name}
              onChange={(event) =>
                setNewCompetencies((current) =>
                  current.map((item, i) =>
                    i === index ? { ...item, name: event.target.value } : item,
                  ),
                )
              }
              placeholder="New competency name"
              className="rounded-md border border-line px-3 py-2 text-sm"
            />
            <input
              value={competency.category}
              onChange={(event) =>
                setNewCompetencies((current) =>
                  current.map((item, i) =>
                    i === index
                      ? { ...item, category: event.target.value }
                      : item,
                  ),
                )
              }
              placeholder="Category"
              className="rounded-md border border-line px-3 py-2 text-sm"
            />
            <input
              value={competency.description}
              onChange={(event) =>
                setNewCompetencies((current) =>
                  current.map((item, i) =>
                    i === index
                      ? { ...item, description: event.target.value }
                      : item,
                  ),
                )
              }
              placeholder="Short description"
              className="rounded-md border border-line px-3 py-2 text-sm"
            />
          </div>
        ))}
      </section>

      <section className="grid gap-4 border-t border-line pt-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="display text-2xl text-ink">Learning objectives</h2>
          <button
            type="button"
            onClick={() => setObjectives((current) => [...current, ""])}
            className="rounded-md bg-paper px-3 py-1.5 text-sm text-ink-soft"
          >
            Add objective
          </button>
        </div>
        {objectives.map((objective, index) => (
          <input
            key={`objective-${index}`}
            value={objective}
            onChange={(event) =>
              setObjectives((current) =>
                current.map((item, i) =>
                  i === index ? event.target.value : item,
                ),
              )
            }
            placeholder={`Objective ${index + 1}`}
            className="rounded-md border border-line bg-white px-3 py-2 text-sm"
          />
        ))}
      </section>

      <section className="grid gap-4 border-t border-line pt-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="display text-2xl text-ink">Learning outcomes</h2>
          <button
            type="button"
            onClick={() =>
              setOutcomes((current) => [
                ...current,
                { statement: "", bloomLevel: "apply" },
              ])
            }
            className="rounded-md bg-paper px-3 py-1.5 text-sm text-ink-soft"
          >
            Add outcome
          </button>
        </div>
        {outcomes.map((outcome, index) => (
          <div
            key={`outcome-${index}`}
            className="grid gap-2 sm:grid-cols-[1fr_180px]"
          >
            <input
              value={outcome.statement}
              onChange={(event) =>
                setOutcomes((current) =>
                  current.map((item, i) =>
                    i === index
                      ? { ...item, statement: event.target.value }
                      : item,
                  ),
                )
              }
              placeholder={`Outcome ${index + 1}`}
              className="rounded-md border border-line bg-white px-3 py-2 text-sm"
            />
            <select
              value={outcome.bloomLevel ?? "apply"}
              onChange={(event) =>
                setOutcomes((current) =>
                  current.map((item, i) =>
                    i === index
                      ? {
                          ...item,
                          bloomLevel: event.target.value as BloomLevel,
                        }
                      : item,
                  ),
                )
              }
              className="rounded-md border border-line bg-white px-3 py-2 text-sm capitalize"
            >
              {BLOOM_LEVELS.map((bloom) => (
                <option key={bloom} value={bloom}>
                  {bloom}
                </option>
              ))}
            </select>
          </div>
        ))}
      </section>

      <section className="grid gap-4 border-t border-line pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="display text-2xl text-ink">
              Theory, demo & exercise sessions
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Add lecture/theory blocks, demos, and student exercises.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SESSION_KINDS.map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() =>
                  setSessions((current) => [...current, emptySession(kind)])
                }
                className="rounded-md bg-paper px-3 py-1.5 text-sm capitalize text-ink-soft"
              >
                Add {kind}
              </button>
            ))}
          </div>
        </div>
        {sessions.map((session, index) => (
          <div
            key={`session-${index}`}
            className="grid gap-3 rounded-lg border border-line bg-white/80 p-4"
          >
            <div className="grid gap-3 sm:grid-cols-[160px_1fr_140px]">
              <select
                value={session.kind}
                onChange={(event) =>
                  setSessions((current) =>
                    current.map((item, i) =>
                      i === index
                        ? {
                            ...item,
                            kind: event.target.value as SessionKind,
                          }
                        : item,
                    ),
                  )
                }
                className="rounded-md border border-line px-3 py-2 text-sm capitalize"
              >
                {SESSION_KINDS.map((kind) => (
                  <option key={kind} value={kind}>
                    {kind}
                  </option>
                ))}
              </select>
              <input
                value={session.title}
                onChange={(event) =>
                  setSessions((current) =>
                    current.map((item, i) =>
                      i === index
                        ? { ...item, title: event.target.value }
                        : item,
                    ),
                  )
                }
                placeholder="Session title"
                className="rounded-md border border-line px-3 py-2 text-sm"
              />
              <input
                type="number"
                min={15}
                max={600}
                value={session.durationMinutes ?? ""}
                onChange={(event) =>
                  setSessions((current) =>
                    current.map((item, i) =>
                      i === index
                        ? {
                            ...item,
                            durationMinutes: event.target.value
                              ? Number(event.target.value)
                              : null,
                          }
                        : item,
                    ),
                  )
                }
                placeholder="Minutes"
                className="rounded-md border border-line px-3 py-2 text-sm"
              />
            </div>
            <textarea
              value={session.description}
              onChange={(event) =>
                setSessions((current) =>
                  current.map((item, i) =>
                    i === index
                      ? { ...item, description: event.target.value }
                      : item,
                  ),
                )
              }
              rows={3}
              placeholder="What happens in this session"
              className="rounded-md border border-line px-3 py-2 text-sm"
            />
          </div>
        ))}
      </section>

      <section className="grid gap-4 border-t border-line pt-6">
        <h2 className="display text-2xl text-ink">Assessment methods</h2>
        <p className="text-sm text-ink-soft">
          Tick the assessment strategies that fit this skillset.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {ASSESSMENT_STRATEGIES.map((strategy) => {
            const checked = assessmentStrategyIds.includes(strategy.id);
            return (
              <label
                key={strategy.id}
                className={`flex cursor-pointer items-start gap-3 rounded-md border px-3 py-3 text-sm transition ${
                  checked
                    ? "border-teal bg-teal/5"
                    : "border-line bg-white hover:border-teal/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAssessment(strategy.id)}
                  className="mt-1"
                />
                <span>
                  <span className="font-medium text-ink">{strategy.label}</span>
                  <span className="mt-1 block text-ink-soft">
                    {strategy.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="justify-self-start rounded-md bg-teal px-5 py-3 font-medium text-white transition hover:bg-teal-deep disabled:opacity-60"
      >
        {saving
          ? "Saving…"
          : mode === "edit"
            ? "Update skillset"
            : "Publish skillset"}
      </button>
    </form>
  );
}
