import { notFound, redirect } from "next/navigation";
import { CourseBuilderForm } from "@/components/course-builder-form";
import { getContributorAccess } from "@/lib/auth";
import { getCourseBySlug, listSkillsets } from "@/lib/queries";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `Edit ${slug}` };
}

export default async function EditCoursePage({ params }: PageProps) {
  const { slug } = await params;
  const access = await getContributorAccess();
  if (!access.signedIn) {
    redirect(`/sign-in?callbackUrl=/courses/${slug}/edit`);
  }

  const [course, skillsets] = await Promise.all([
    getCourseBySlug(slug),
    listSkillsets({}),
  ]);
  if (!course) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="display text-4xl text-ink">Edit course</h1>
      <p className="mt-3 text-ink-soft">
        Update details or change which skillsets are combined.
      </p>
      <div className="mt-8">
        <CourseBuilderForm
          mode="edit"
          skillsets={skillsets.map((item) => ({
            id: item.id,
            title: item.title,
            summary: item.summary,
            level: item.level,
            topicName: item.topicName,
          }))}
          initial={{
            id: course.id,
            title: course.title,
            code: course.code,
            summary: course.summary,
            targetAudience: course.targetAudience,
            skillsetIds: course.skillsetIds,
          }}
        />
      </div>
    </div>
  );
}
