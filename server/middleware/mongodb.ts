import { Db, MongoClient } from 'mongodb';
import config from '../config';

if (!config.MONGODB_URI || !config.MONGODB_DB) {
  throw new Error('Define the MONGODB_URI and MONGODB_DB environmental variables');
}

// Mongoose Cache
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  // check the cached.
  if (cachedClient && cachedDb) {
    // load from cache
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // Connect to cluster
  const client = new MongoClient(config.MONGODB_URI);
  await client.connect();
  const db = client.db(config.MONGODB_DB);

  // set cache
  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}