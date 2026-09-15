#!/usr/bin/env node

const { createHash } = require("node:crypto");
const { readFileSync } = require("node:fs");
const { join, relative, resolve, sep } = require("node:path");
const { gunzipSync } = require("node:zlib");
const { getDateRange } = require("./export-archive");

const FIRST_ARCHIVE_DATE = "2009-01-01";
const LAST_ARCHIVE_DATE = "2022-12-31";

const verifyArchive = (outputDirectory) => {
  const directory = resolve(outputDirectory);
  const manifest = JSON.parse(readFileSync(join(directory, "manifest.json"), "utf8"));
  const expectedDates = getDateRange(FIRST_ARCHIVE_DATE, LAST_ARCHIVE_DATE);

  if (!Array.isArray(manifest.objects)) throw new Error("Manifest objects must be an array");
  if (manifest.objectCount !== expectedDates.length || manifest.objects.length !== expectedDates.length) {
    throw new Error(`Expected ${expectedDates.length} date objects, found ${manifest.objects.length}`);
  }

  let postCount = 0;
  let compressedBytes = 0;
  let uncompressedBytes = 0;

  manifest.objects.forEach((object, index) => {
    const expectedDate = expectedDates[index];
    if (object.date !== expectedDate || object.key !== `dates/${expectedDate}.json.gz`) {
      throw new Error(`Unexpected manifest entry at index ${index}`);
    }

    const path = resolve(directory, object.key);
    const pathWithinExport = relative(directory, path);
    if (pathWithinExport.startsWith(`..${sep}`) || pathWithinExport === "..") {
      throw new Error(`Object path leaves export directory: ${object.key}`);
    }

    const compressed = readFileSync(path);
    const checksum = createHash("sha256").update(compressed).digest("hex");
    if (compressed.length !== object.bytes || checksum !== object.sha256) {
      throw new Error(`Compressed object verification failed for ${expectedDate}`);
    }

    const json = gunzipSync(compressed).toString("utf8");
    const posts = JSON.parse(json);
    if (!Array.isArray(posts) || posts.length !== object.posts) {
      throw new Error(`Post count verification failed for ${expectedDate}`);
    }
    if (posts.some((post) => post?.created_date !== expectedDate)) {
      throw new Error(`Post date verification failed for ${expectedDate}`);
    }
    if (Buffer.byteLength(json) !== object.uncompressedBytes) {
      throw new Error(`Uncompressed size verification failed for ${expectedDate}`);
    }

    postCount += posts.length;
    compressedBytes += compressed.length;
    uncompressedBytes += Buffer.byteLength(json);
  });

  if (
    postCount !== manifest.postCount ||
    compressedBytes !== manifest.compressedBytes ||
    uncompressedBytes !== manifest.uncompressedBytes
  ) {
    throw new Error("Manifest aggregate verification failed");
  }

  return { objectCount: manifest.objectCount, postCount, compressedBytes, uncompressedBytes };
};

const main = () => {
  const outputDirectory = process.argv[2] || process.env.ARCHIVE_EXPORT_DIR || "archive-export";
  console.log(JSON.stringify(verifyArchive(outputDirectory), null, 2));
};

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Archive verification failed");
    process.exitCode = 1;
  }
}

module.exports = { verifyArchive };
