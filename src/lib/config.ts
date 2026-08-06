/**
 * Optional Edge Config — only used when env vars are present and valid.
 * Broken/hardcoded tokens caused silent save failures and post-submit 404s.
 */
export const EDGE_CONFIG_ID =
  process.env.EDGE_CONFIG_ID ?? "ecfg_yyeqcds7wvbnksllklj4jn2xocjp";
export const EDGE_CONFIG_TOKEN =
  process.env.EDGE_CONFIG_TOKEN ?? process.env.EDGE_CONFIG?.match(/token=([^&]+)/)?.[1] ?? "";
export const EDGE_CONFIG_URL =
  process.env.EDGE_CONFIG ??
  (EDGE_CONFIG_TOKEN
    ? `https://edge-config.vercel.com/${EDGE_CONFIG_ID}?token=${EDGE_CONFIG_TOKEN}`
    : "");
/** Vercel API token with Edge Config write access (not the read connection token). */
export const EDGE_CONFIG_WRITE_TOKEN =
  process.env.EDGE_CONFIG_WRITE_TOKEN ?? process.env.VERCEL_API_TOKEN ?? "";
export const EDGE_CONFIG_DB_KEY = "geoskills_db";

/** Canonical production URL (apex redirects to www) */
export const SITE_DOMAIN = "www.geospatialskills.in";
export const SITE_URL = `https://${SITE_DOMAIN}`;

/**
 * Auth.js session encryption secret (app-level cookie signing).
 * Not a personal password — any Google account can sign in.
 * Kept in code so a missing/empty Vercel AUTH_SECRET cannot break login.
 */
export const AUTH_SECRET = "DUAMxRnZspU2wmwr5WhpImQXAMiAZVH0KB0sM5SEFkY=";
