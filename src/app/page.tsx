import Link from "next/link";
import { listSkillsets } from "@/lib/queries";
import { SkillsetCard } from "@/components/skillset-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await listSkillsets({});

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(105deg, rgba(20,33,43,0.72) 18%, rgba(15,107,99,0.45) 58%, rgba(20,33,43,0.25) 100%), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80')",
            }}
          />
          <svg
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-teal/40"
            viewBox="0 0 1200 160"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              className="topo-path"
              d="M0 110 C180 70 280 140 460 100 S780 40 980 90 1200 70 1200 70"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className="topo-path pulse-soft"
              d="M0 130 C220 90 340 150 520 120 S820 70 1040 110 1200 100 1200 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.6"
            />
          </svg>
        </div>

        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-6 pb-16 pt-28 text-white">
          <p className="animate-rise display text-4xl sm:text-6xl md:text-7xl">
            GeoSkills Atlas
          </p>
          <h1 className="animate-rise-delay mt-5 max-w-2xl text-xl font-medium leading-snug sm:text-2xl">
            A shared database of geospatial skillsets for faculty course planning.
          </h1>
          <p className="animate-rise-late mt-4 max-w-xl text-base text-white/85 sm:text-lg">
            Browse competencies, frame objectives and outcomes, and collect
            exercises you can reuse across programs.
          </p>
          <div className="animate-rise-late mt-8 flex flex-wrap gap-3">
            <Link
              href="/skillsets"
              className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-paper"
            >
              Explore skillsets
            </Link>
            <Link
              href="/contribute"
              className="rounded-md border border-white/50 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Contribute a skillset
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="display text-3xl text-ink">Featured skillsets</h2>
            <p className="mt-2 max-w-2xl text-ink-soft">
              Filterable catalog of competencies, outcomes, and classroom
              exercises for geospatial curricula.
            </p>
          </div>
          <Link href="/skillsets" className="text-sm font-medium text-teal">
            View all
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.slice(0, 6).map((skillset) => (
            <SkillsetCard key={skillset.id} skillset={skillset} />
          ))}
        </div>
      </section>
    </div>
  );
}
