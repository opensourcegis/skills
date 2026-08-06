export function SetupBanner() {
  return (
    <div className="mb-10 rounded-xl border border-sand/40 bg-[rgba(196,165,116,0.12)] px-5 py-4 text-sm text-ink">
      <p className="font-semibold">Finish setup to go live</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-ink-soft">
        <li>
          Add Neon:{" "}
          <code className="rounded bg-white/70 px-1">
            npx vercel integration add neon
          </code>
        </li>
        <li>
          Create a Google Cloud OAuth client (Web) and set{" "}
          <code className="rounded bg-white/70 px-1">AUTH_GOOGLE_ID</code>,{" "}
          <code className="rounded bg-white/70 px-1">AUTH_GOOGLE_SECRET</code>,
          and <code className="rounded bg-white/70 px-1">AUTH_SECRET</code>
        </li>
        <li>
          Set faculty emails in{" "}
          <code className="rounded bg-white/70 px-1">ALLOWED_EMAILS</code>, then
          run{" "}
          <code className="rounded bg-white/70 px-1">npm run db:push</code> and{" "}
          <code className="rounded bg-white/70 px-1">npm run db:seed</code>
        </li>
        <li>
          In Vercel project settings, turn{" "}
          <strong>Deployment Protection</strong> off (or Standard Protection
          only for previews you want private) so visitors are not asked for a
          Vercel account
        </li>
      </ol>
    </div>
  );
}
