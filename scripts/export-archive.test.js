const { mkdtempSync, readFileSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const { gunzipSync } = require("node:zlib");
const { createManifest, getDateRange, writeDateObject } = require("./export-archive");

describe("archive exporter", () => {
  it("covers the complete 5,113-day archive range", () => {
    const dates = getDateRange("2009-01-01", "2022-12-31");
    expect(dates).toHaveLength(5113);
    expect(dates[0]).toBe("2009-01-01");
    expect(dates.at(-1)).toBe("2022-12-31");
  });

  it("writes deterministic, score-ordered gzip objects and a measurable manifest", () => {
    const outputDirectory = mkdtempSync(join(tmpdir(), "reddit-archive-export-"));
    const posts = [
      { id: "low", title: "Low", score: 1, created_date: "2014-07-04" },
      { id: "high", title: "High", score: 100, created_date: "2014-07-04" },
    ];

    const first = writeDateObject(outputDirectory, "2014-07-04", posts);
    const second = writeDateObject(outputDirectory, "2014-07-04", posts);
    const payload = JSON.parse(
      gunzipSync(readFileSync(join(outputDirectory, "dates/2014-07-04.json.gz"))).toString("utf8")
    );
    const manifest = createManifest([first]);

    expect(payload.map((post) => post.id)).toEqual(["high", "low"]);
    expect(second.sha256).toBe(first.sha256);
    expect(manifest).toMatchObject({
      objectCount: 1,
      postCount: 2,
      compressedBytes: first.bytes,
      uncompressedBytes: first.uncompressedBytes,
    });
  });
});
