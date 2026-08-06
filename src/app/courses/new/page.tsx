import { redirect } from "next/navigation";
import { getContributorAccess } from "@/lib/auth";
import { CourseBuilderForm } from "@/components/course-builder-form";
import { listSkillsets } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Build a course",
};

export default async function NewCoursePage() {
  const access = await getContributorAccess();
  if (!access.signedIn) redirect("/sign-in?callbackUrl=/courses/new");

  const skillsets = await listSkillsets({});

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="display text-4xl text-ink">Build a course</h1>
      <p className="mt-3 text-ink-soft">
        Select skillsets to combine into one course information sheet.
      </p>
      <div className="mt-8">
        <CourseBuilderForm
          skillsets={skillsets.map((item) => ({
            id: item.id,
            title: item.title,
            summary: item.summary,
            level: item.level,
            topicName: item.topicName,
          }))}
        />
      </div>
    </div>
  );
}
