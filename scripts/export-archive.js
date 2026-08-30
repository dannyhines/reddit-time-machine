#!/usr/bin/env node

const { createHash } = require("node:crypto");
const { existsSync, mkdirSync, readdirSync, renameSync, writeFileSync } = require("node:fs");
const { join, resolve } = require("node:path");
const { gzipSync } = require("node:zlib");
const { Client } = require("pg");

const FIRST_ARCHIVE_DATE = "2009-01-01";
const LAST_ARCHIVE_DATE = "2022-12-31";
const DEFAULT_BATCH_SIZE = 1_000;
const POST_COLUMNS = [
  "id",
  "title",
  "url",
  "created_utc",
  "author",
  "domain",
  "hidden",
  "score",
  "ups",
  "downs",
  "is_reddit_media_domain",
  "is_video",
  "num_comments",
  "num_crossposts",
  "permalink",
  "preview",
  "subreddit",
  "subreddit_id",
  "thumbnail",
  "thumbnail_height",
  "thumbnail_width",
  "created_date",
  "post_type",
];

const requiredDatabaseVariables = ["DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_DATABASE"];

const normalizeDate = (value) =>
  value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10);

const addUtcDay = (date) => {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return value.toISOString().slice(0, 10);
};

const getDateRange = (firstDate, lastDate) => {
  const dates = [];
  for (let date = firstDate; date <= lastDate; date = addUtcDay(date)) dates.push(date);
  return dates;
};

const sortPosts = (posts) =>
  [...posts].sort((left, right) => {
    if (left.score == null && right.score != null) return 1;
    if (left.score != null && right.score == null) return -1;
    if (left.score !== right.score) return Number(right.score) - Number(left.score);
    return String(left.id).localeCompare(String(right.id));
  });

const writeDateObject = (outputDirectory, date, posts) => {
  const datesDirectory = join(outputDirectory, "dates");
  mkdirSync(datesDirectory, { recursive: true });

  const json = Buffer.from(JSON.stringify(sortPosts(posts)));
  const compressed = gzipSync(json, { level: 9, mtime: 0 });
  const path = join(datesDirectory, `${date}.json.gz`);
  const temporaryPath = `${path}.tmp`;
  writeFileSync(temporaryPath, compressed);
  renameSync(temporaryPath, path);

  return {
    date,
    key: `dates/${date}.json.gz`,
    posts: posts.length,
    bytes: compressed.length,
    uncompressedBytes: json.length,
    sha256: createHash("sha256").update(compressed).digest("hex"),
  };
};

const createManifest = (objects) => ({
  schemaVersion: 1,
  contentType: "application/json",
  contentEncoding: "gzip",
  cacheControl: "public, max-age=31536000, immutable",
  firstDate: objects[0]?.date ?? null,
  lastDate: objects.at(-1)?.date ?? null,
  objectCount: objects.length,
  postCount: objects.reduce((total, object) => total + object.posts, 0),
  compressedBytes: objects.reduce((total, object) => total + object.bytes, 0),
  uncompressedBytes: objects.reduce((total, object) => total + object.uncompressedBytes, 0),
  objects,
});

const assertEmptyOutputDirectory = (outputDirectory) => {
  if (existsSync(outputDirectory) && readdirSync(outputDirectory).length > 0) {
    throw new Error(`Output directory is not empty: ${outputDirectory}`);
  }
  mkdirSync(outputDirectory, { recursive: true });
};

const createDatabaseClient = () => {
  const missing = requiredDatabaseVariables.filter((name) => !process.env[name]);
  if (missing.length) throw new Error(`Missing database environment variables: ${missing.join(", ")}`);

  return new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    ssl: { rejectUnauthorized: false },
    application_name: "reddit-time-machine-archive-export",
  });
};

const exportArchive = async ({
  outputDirectory,
  firstDate = FIRST_ARCHIVE_DATE,
  lastDate = LAST_ARCHIVE_DATE,
  batchSize = DEFAULT_BATCH_SIZE,
}) => {
  assertEmptyOutputDirectory(outputDirectory);
  const client = createDatabaseClient();
  const objects = [];
  let afterDate = null;
  let afterId = null;
  let currentDate = null;
  let currentPosts = [];
  let nextExpectedDate = firstDate;

  const writeExpectedDate = (date, posts) => {
    while (nextExpectedDate < date) {
      objects.push(writeDateObject(outputDirectory, nextExpectedDate, []));
      nextExpectedDate = addUtcDay(nextExpectedDate);
    }
    objects.push(writeDateObject(outputDirectory, date, posts));
    nextExpectedDate = addUtcDay(date);
    if (objects.length % 250 === 0) console.log(`Exported ${objects.length} date objects`);
  };

  await client.connect();
  try {
    while (true) {
      const result = await client.query(
        `SELECT ${POST_COLUMNS.join(", ")}
         FROM public.top_posts
         WHERE created_date BETWEEN $1::date AND $2::date
           AND ($3::date IS NULL OR (created_date, id) > ($3::date, $4::text))
         ORDER BY created_date ASC, id ASC
         LIMIT $5`,
        [firstDate, lastDate, afterDate, afterId, batchSize]
      );

      if (!result.rows.length) break;

      for (const databasePost of result.rows) {
        const post = { ...databasePost, created_date: normalizeDate(databasePost.created_date) };
        if (currentDate && post.created_date !== currentDate) {
          writeExpectedDate(currentDate, currentPosts);
          currentPosts = [];
        }
        currentDate = post.created_date;
        currentPosts.push(post);
        afterDate = post.created_date;
        afterId = post.id;
      }
    }

    if (currentDate) writeExpectedDate(currentDate, currentPosts);
    while (nextExpectedDate <= lastDate) {
      writeExpectedDate(nextExpectedDate, []);
    }

    const manifest = createManifest(objects);
    writeFileSync(join(outputDirectory, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
    return manifest;
  } finally {
    await client.end();
  }
};

const main = async () => {
  const outputArgument = process.argv.indexOf("--output");
  const outputDirectory = resolve(
    outputArgument >= 0 ? process.argv[outputArgument + 1] : process.env.ARCHIVE_EXPORT_DIR || "archive-export"
  );
  const batchSize = Number(process.env.ARCHIVE_EXPORT_BATCH_SIZE || DEFAULT_BATCH_SIZE);
  if (!Number.isInteger(batchSize) || batchSize < 1) {
    throw new Error("ARCHIVE_EXPORT_BATCH_SIZE must be a positive integer");
  }

  const manifest = await exportArchive({ outputDirectory, batchSize });
  console.log(
    `Export complete: ${manifest.objectCount} objects, ${manifest.postCount} posts, ${manifest.compressedBytes} compressed bytes`
  );
  console.log(`Manifest: ${join(outputDirectory, "manifest.json")}`);
};

if (require.main === module) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : "Archive export failed");
    process.exitCode = 1;
  });
}

module.exports = { createManifest, exportArchive, getDateRange, sortPosts, writeDateObject };
