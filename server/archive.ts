import { gunzipSync } from "node:zlib";
import { Post } from "../types/Post";
import { getPostsForDateFromDatabase } from "./database";

const ARCHIVE_CACHE_LIMIT = 256;
const archiveCache = new Map<string, Promise<Post[]>>();

class ArchiveObjectError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "ArchiveObjectError";
  }
}

const getArchiveObjectUrl = (date: string) => {
  const baseUrl = process.env.ARCHIVE_BASE_URL?.replace(/\/+$/, "");
  return baseUrl ? `${baseUrl}/dates/${date}.json.gz` : null;
};

const parseArchiveObject = (payload: Buffer, date: string): Post[] => {
  const json = payload[0] === 0x1f && payload[1] === 0x8b ? gunzipSync(payload).toString("utf8") : payload.toString("utf8");
  const value: unknown = JSON.parse(json);

  if (
    !Array.isArray(value) ||
    value.some(
      (post) =>
        typeof post !== "object" ||
        post === null ||
        typeof (post as Post).id !== "string" ||
        typeof (post as Post).title !== "string" ||
        (post as Post).created_date !== date
    )
  ) {
    throw new ArchiveObjectError(`Archive object for ${date} has an invalid shape`);
  }

  return value as Post[];
};

const fetchArchiveObject = async (date: string): Promise<Post[]> => {
  const url = getArchiveObjectUrl(date);
  if (!url) throw new ArchiveObjectError("ARCHIVE_BASE_URL is not configured");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  let response: Response;
  try {
    response = await fetch(url, {
      cache: "force-cache",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new ArchiveObjectError(`Archive object request failed with status ${response.status}`, response.status);
  }

  return parseArchiveObject(Buffer.from(await response.arrayBuffer()), date);
};

const getCachedArchiveObject = (date: string) => {
  const cached = archiveCache.get(date);
  if (cached) {
    archiveCache.delete(date);
    archiveCache.set(date, cached);
    return cached;
  }

  const pending = fetchArchiveObject(date).catch((error) => {
    archiveCache.delete(date);
    throw error;
  });
  archiveCache.set(date, pending);

  if (archiveCache.size > ARCHIVE_CACHE_LIMIT) {
    archiveCache.delete(archiveCache.keys().next().value as string);
  }

  return pending;
};

export const getPostsForDate = async (date: string): Promise<Post[]> => {
  if (!process.env.ARCHIVE_BASE_URL) {
    return getPostsForDateFromDatabase(date);
  }

  try {
    return await getCachedArchiveObject(date);
  } catch (error) {
    if (process.env.ARCHIVE_DATABASE_FALLBACK !== "true") throw error;

    const status = error instanceof ArchiveObjectError ? error.status : undefined;
    console.warn(`[archive] Static object unavailable for ${date}${status ? ` (${status})` : ""}; using database fallback`);
    return getPostsForDateFromDatabase(date);
  }
};

export const clearArchiveCacheForTests = () => archiveCache.clear();
