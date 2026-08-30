import { Pool } from "pg";
import { Post } from "../types/Post";

export type DatabasePost = Omit<Post, "created_date"> & { created_date: string | Date };

export const normalizeDatabasePost = (post: DatabasePost): Post => ({
  ...post,
  created_date:
    post.created_date instanceof Date
      ? post.created_date.toISOString().slice(0, 10)
      : String(post.created_date).slice(0, 10),
});

const requiredDatabaseVariables = ["DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_DATABASE"] as const;

const createPool = () => {
  const missingVariables = requiredDatabaseVariables.filter((name) => !process.env[name]);
  if (missingVariables.length) {
    throw new Error(`Missing database environment variables: ${missingVariables.join(", ")}`);
  }

  return new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    ssl: { rejectUnauthorized: false },
  });
};

const globalForDatabase = globalThis as typeof globalThis & {
  redditTimeMachinePool?: Pool;
};

export const getDatabasePool = () => {
  if (!globalForDatabase.redditTimeMachinePool) {
    globalForDatabase.redditTimeMachinePool = createPool();
  }

  return globalForDatabase.redditTimeMachinePool;
};

export const getPostsForDateFromDatabase = async (date: string) => {
  const result = await getDatabasePool().query<DatabasePost>(
    `SELECT * FROM top_posts WHERE created_date = $1 ORDER BY score DESC NULLS LAST;`,
    [date]
  );

  return result.rows.map(normalizeDatabasePost);
};
