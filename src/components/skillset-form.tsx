"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { createSkillset, updateSkillset } from "@/lib/actions";
import {
  BLOOM_LEVELS,
  EXERCISE_TYPES,
  LEVELS,
  type BloomLevel,
  type ExerciseType,
  type Level,
} from "@/lib/utils";
import type { SkillsetFormValues } from "@/lib/validators";

type Option = { id: string; name: string };

type SkillsetFormProps = {
  topics: Option[];
  competencies: Option[];
  initial?: Partial<SkillsetFormValues> & { id?: string };
  mode?: "create" | "edit";
};

const emptyExercise = {
  title: "",
  description: "",
  exerciseType: "lab" as ExerciseType,
  durationMinutes: 90 as number | null,
};

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
  const [objectives, setObjectives] = useState<string[]>(
    initial?.objectives ?? [""],
  );
  const [outcomes, setOutcomes] = useState(
    initial?.outcomes ?? [{ statement: "", bloomLevel: "apply" as BloomLevel }],
  );
  const [exercises, setExercises] = useState(
    initial?.exercises ?? [emptyExercise],
  );

  function toggleCompetency(id: string) {
    setCompetencyIds((current) =>
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
      objectives: objectives.filter(Boolean),
      outcomes: outcomes.filter((item) => item.statement.trim()),
      exercises: exercises.filter(
        (item) => item.title.trim() && item.description.trim(),
      ),
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
            placeholder="e.g. Urban heat mapping with Landsat"
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
        <h2 className="display text-2xl text-ink">Competencies</h2>
        <p className="text-sm text-ink-soft">
          Select the competencies this skillset develops.
        </p>
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
          <div key={`outcome-${index}`} className="grid gap-2 sm:grid-cols-[1fr_180px]">
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
        <div className="flex items-center justify-between gap-3">
          <h2 className="display text-2xl text-ink">Exercises</h2>
          <button
            type="button"
            onClick={() =>
              setExercises((current) => [...current, emptyExercise])
            }
            className="rounded-md bg-paper px-3 py-1.5 text-sm text-ink-soft"
          >
            Add exercise
          </button>
        </div>
        {exercises.map((exercise, index) => (
          <div
            key={`exercise-${index}`}
            className="grid gap-3 rounded-lg border border-line bg-white/80 p-4"
          >
            <input
              value={exercise.title}
              onChange={(event) =>
                setExercises((current) =>
                  current.map((item, i) =>
                    i === index ? { ...item, title: event.target.value } : item,
                  ),
                )
              }
              placeholder="Exercise title"
              className="rounded-md border border-line px-3 py-2 text-sm"
            />
            <textarea
              value={exercise.description}
              onChange={(event) =>
                setExercises((current) =>
                  current.map((item, i) =>
                    i === index
                      ? { ...item, description: event.target.value }
                      : item,
                  ),
                )
              }
              rows={3}
              placeholder="What students do, tools used, deliverable"
              className="rounded-md border border-line px-3 py-2 text-sm"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={exercise.exerciseType}
                onChange={(event) =>
                  setExercises((current) =>
                    current.map((item, i) =>
                      i === index
                        ? {
                            ...item,
                            exerciseType: event.target.value as ExerciseType,
                          }
                        : item,
                    ),
                  )
                }
                className="rounded-md border border-line px-3 py-2 text-sm capitalize"
              >
                {EXERCISE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={15}
                max={600}
                value={exercise.durationMinutes ?? ""}
                onChange={(event) =>
                  setExercises((current) =>
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
                placeholder="Duration (minutes)"
                className="rounded-md border border-line px-3 py-2 text-sm"
              />
            </div>
          </div>
        ))}
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
