import Link from "next/link";
import { getContributorAccess } from "@/lib/auth";
import { listCourses } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Courses",
};

export default async function CoursesPage() {
  const [courses, access] = await Promise.all([
    listCourses(),
    getContributorAccess(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-4xl text-ink">Courses</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Combine skillsets into a custom course and generate a course
            information sheet.
          </p>
        </div>
        {access.allowed ? (
          <Link
            href="/courses/new"
            className="rounded-md bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-deep"
          >
            Build a course
          </Link>
        ) : (
          <Link
            href="/sign-in?callbackUrl=/courses/new"
            className="rounded-md bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-deep"
          >
            Sign in to build
          </Link>
        )}
      </div>

      {courses.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line bg-white/60 px-5 py-10 text-ink-soft">
          No courses yet. Combine two or more skillsets to create the first
          course information sheet.
        </p>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="block border-t-2 border-teal/40 bg-white/70 p-6 transition hover:border-teal"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">
                {course.code}
              </p>
              <h2 className="display mt-2 text-2xl text-ink">{course.title}</h2>
              <p className="mt-2 text-sm text-ink-soft">{course.summary}</p>
              <p className="mt-3 text-xs text-ink-soft">
                {course.skillsetIds.length} skillsets · {course.targetAudience}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
