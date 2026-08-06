export function isClerkConfigured() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!key) return false;
  // Reject obvious placeholders used before Marketplace provisioning.
  if (key.includes("placeholder")) return false;
  return key.startsWith("pk_");
}
