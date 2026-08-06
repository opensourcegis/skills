import { attachDatabasePool } from "@vercel/functions";
import { MongoClient, type MongoClientOptions } from "mongodb";
import { getMongoUri } from "@/lib/config";

const options: MongoClientOptions = {
  appName: "devrel.vercel.integration",
  maxIdleTimeMS: 5000,
};

const uri = getMongoUri();

// Module-scoped client shared across function invocations (Vercel Atlas pattern).
const client = uri ? new MongoClient(uri, options) : null;

if (client) {
  // Ensure proper cleanup when a Fluid Compute instance is suspended.
  attachDatabasePool(client);
}

export default client;

export function requireMongoClient(): MongoClient {
  if (!client) {
    throw new Error(
      "MongoDB is not configured. Set geospatialskills_storage_MONGODB_URI (or MONGODB_URI) in Vercel env.",
    );
  }
  return client;
}
