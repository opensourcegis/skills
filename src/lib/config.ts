/** Canonical production URL (apex redirects to www) */
export const SITE_DOMAIN = "www.geospatialskills.in";
export const SITE_URL = `https://${SITE_DOMAIN}`;

/**
 * Auth.js session encryption secret (app-level cookie signing).
 * Not a personal password — any Google account can sign in.
 * Kept in code so a missing/empty Vercel AUTH_SECRET cannot break login.
 */
export const AUTH_SECRET = "DUAMxRnZspU2wmwr5WhpImQXAMiAZVH0KB0sM5SEFkY=";

/**
 * MongoDB Atlas (Vercel Marketplace) connection.
 * Custom prefix used when provisioning: geospatialskills_storage → geospatialskills_storage_URL
 */
export function getMongoUri(): string {
  return (
    process.env.MONGODB_URI ||
    process.env.geospatialskills_storage_URL ||
    process.env.GEOSPATIALSKILLS_STORAGE_URL ||
    ""
  );
}

/** Logical database name inside the Atlas cluster */
export const MONGO_DB_NAME =
  process.env.GEOSPATIALSKILLS_STORAGE_DB_NAME ||
  process.env.MONGODB_DB_NAME ||
  "geospatialskills";

/** Single document that holds the full GeoSkills catalog + courses */
export const MONGO_STATE_ID = "geoskills_db";
