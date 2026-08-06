"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type FilterOption = { slug: string; name: string };

type SkillsetFiltersProps = {
  topics: FilterOption[];
  competencies: FilterOption[];
  levels: string[];
};

export function SkillsetFilters({
  topics,
  competencies,
  levels,
}: SkillsetFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    startTransition(() => {
      router.push(`/skillsets?${params.toString()}`);
    });
  }

  function setView(view: "card" | "list") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    startTransition(() => {
      router.push(`/skillsets?${params.toString()}`);
    });
  }

  return (
    <div
      className={`grid gap-4 rounded-xl border border-line bg-white/75 p-4 sm:p-5 ${
        pending ? "opacity-70" : ""
      }`}
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-ink">Search</span>
          <input
            defaultValue={searchParams.get("q") ?? ""}
            onChange={(event) => update("q", event.target.value)}
            placeholder="Skills, outcomes, keywords"
            className="rounded-md border border-line bg-mist px-3 py-2 outline-none ring-teal/30 focus:ring-2"
          />
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-ink">Topic</span>
          <select
            defaultValue={searchParams.get("topic") ?? ""}
            onChange={(event) => update("topic", event.target.value)}
            className="rounded-md border border-line bg-mist px-3 py-2 outline-none ring-teal/30 focus:ring-2"
          >
            <option value="">All topics</option>
            {topics.map((topic) => (
              <option key={topic.slug} value={topic.slug}>
                {topic.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-ink">Competency</span>
          <select
            defaultValue={searchParams.get("competency") ?? ""}
            onChange={(event) => update("competency", event.target.value)}
            className="rounded-md border border-line bg-mist px-3 py-2 outline-none ring-teal/30 focus:ring-2"
          >
            <option value="">All competencies</option>
            {competencies.map((competency) => (
              <option key={competency.slug} value={competency.slug}>
                {competency.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-ink">Level</span>
          <select
            defaultValue={searchParams.get("level") ?? ""}
            onChange={(event) => update("level", event.target.value)}
            className="rounded-md border border-line bg-mist px-3 py-2 outline-none ring-teal/30 focus:ring-2"
          >
            <option value="">All levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-ink">Outcome contains</span>
          <input
            defaultValue={searchParams.get("outcome") ?? ""}
            onChange={(event) => update("outcome", event.target.value)}
            placeholder="e.g. accuracy, map, field"
            className="rounded-md border border-line bg-mist px-3 py-2 outline-none ring-teal/30 focus:ring-2"
          />
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView("card")}
            className={`rounded-md px-3 py-2 text-sm ${
              (searchParams.get("view") ?? "card") === "card"
                ? "bg-teal text-white"
                : "bg-paper text-ink-soft"
            }`}
          >
            Cards
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`rounded-md px-3 py-2 text-sm ${
              searchParams.get("view") === "list"
                ? "bg-teal text-white"
                : "bg-paper text-ink-soft"
            }`}
          >
            List
          </button>
        </div>
      </div>
    </div>
  );
}
