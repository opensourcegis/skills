export function SetupBanner() {
  return (
    <div className="mb-10 rounded-xl border border-sand/40 bg-[rgba(196,165,116,0.12)] px-5 py-4 text-sm text-ink">
      <p className="font-semibold">Connect Vercel integrations to go live</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-ink-soft">
        <li>
          Authenticate Vercel CLI / MCP, then{" "}
          <code className="rounded bg-white/70 px-1">npx vercel link</code>
        </li>
        <li>
          Provision database and auth:{" "}
          <code className="rounded bg-white/70 px-1">
            npx vercel integration add neon
          </code>{" "}
          and{" "}
          <code className="rounded bg-white/70 px-1">
            npx vercel integration add clerk
          </code>
        </li>
        <li>
          Pull env vars, set{" "}
          <code className="rounded bg-white/70 px-1">ALLOWED_EMAILS</code>, then
          run{" "}
          <code className="rounded bg-white/70 px-1">npm run db:push</code> and{" "}
          <code className="rounded bg-white/70 px-1">npm run db:seed</code>
        </li>
      </ol>
    </div>
  );
}
