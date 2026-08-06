"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteCourse } from "@/lib/actions";

export function CourseActions({
  courseId,
  courseSlug,
}: {
  courseId: string;
  courseSlug: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onDelete() {
    const confirmed = window.confirm(
      "Delete this course permanently? This cannot be undone.",
    );
    if (!confirmed) return;

    setError(null);
    const result = await deleteCourse(courseId);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    startTransition(() => {
      router.push("/courses");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={`/courses/${courseSlug}/edit`}
        className="rounded-md bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-deep"
      >
        Edit
      </a>
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
      >
        {pending ? "Deleting…" : "Delete"}
      </button>
      {error ? <p className="w-full text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
