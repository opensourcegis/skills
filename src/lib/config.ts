/**
 * Vercel Edge Config connection — hardcoded per project request.
 * ID: ecfg_yyeqcds7wvbnksllklj4jn2xocjp
 */
export const EDGE_CONFIG_ID = "ecfg_yyeqcds7wvbnksllklj4jn2xocjp";
export const EDGE_CONFIG_TOKEN =
  "5bf6b008a9ec05f6870c476d10b53211797aa000f95aae344ae60f9b422286da";
export const EDGE_CONFIG_URL = `https://edge-config.vercel.com/${EDGE_CONFIG_ID}?token=${EDGE_CONFIG_TOKEN}`;
export const EDGE_CONFIG_DB_KEY = "geoskills_db";

/** Production site domain (apex redirects to www on Vercel) */
export const SITE_DOMAIN = "www.geospatialskills.in";
export const SITE_URL = `https://${SITE_DOMAIN}`;

/**
 * Auth.js session encryption secret (app-level, not a personal password).
 * Any Google account can still sign in — this only signs cookies.
 */
export const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  "DUAMxRnZspU2wmwr5WhpImQXAMiAZVH0KB0sM5SEFkY=";
