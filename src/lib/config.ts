/**
 * Vercel Edge Config connection — hardcoded per project request.
 * ID: ecfg_yyeqcds7wvbnksllklj4jn2xocjp
 */
export const EDGE_CONFIG_ID = "ecfg_yyeqcds7wvbnksllklj4jn2xocjp";
export const EDGE_CONFIG_TOKEN =
  "5bf6b008a9ec05f6870c476d10b53211797aa000f95aae344ae60f9b422286da";
export const EDGE_CONFIG_URL = `https://edge-config.vercel.com/${EDGE_CONFIG_ID}?token=${EDGE_CONFIG_TOKEN}`;
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
