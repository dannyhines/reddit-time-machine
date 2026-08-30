import { gzipSync } from "node:zlib";
import { Post } from "../types/Post";
import { getPostsForDateFromDatabase } from "./database";
import { clearArchiveCacheForTests, getPostsForDate } from "./archive";

jest.mock("./database", () => ({
  getPostsForDateFromDatabase: jest.fn(),
}));

const mockedDatabaseRead = jest.mocked(getPostsForDateFromDatabase);
const mockedFetch = jest.fn();

const post: Post = {
  id: "post-1",
  title: "An archived post",
  url: "https://example.com",
  created_utc: 0,
  author: "author",
  domain: "example.com",
  score: 100,
  permalink: "/r/news/comments/post-1",
  subreddit: "news",
  created_date: "2014-07-04",
  post_type: "news",
};

const mockResponse = (payload: Buffer, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  arrayBuffer: async () => Uint8Array.from(payload).buffer,
});

describe("archive object loader", () => {
  const originalBaseUrl = process.env.ARCHIVE_BASE_URL;
  const originalFallback = process.env.ARCHIVE_DATABASE_FALLBACK;

  beforeAll(() => {
    global.fetch = mockedFetch as typeof fetch;
  });

  beforeEach(() => {
    clearArchiveCacheForTests();
    mockedFetch.mockReset();
    mockedDatabaseRead.mockReset();
    delete process.env.ARCHIVE_BASE_URL;
    delete process.env.ARCHIVE_DATABASE_FALLBACK;
  });

  afterAll(() => {
    if (originalBaseUrl === undefined) delete process.env.ARCHIVE_BASE_URL;
    else process.env.ARCHIVE_BASE_URL = originalBaseUrl;
    if (originalFallback === undefined) delete process.env.ARCHIVE_DATABASE_FALLBACK;
    else process.env.ARCHIVE_DATABASE_FALLBACK = originalFallback;
  });

  it("loads a compressed date object and caches repeated reads", async () => {
    process.env.ARCHIVE_BASE_URL = "https://archive.example.com/";
    mockedFetch.mockResolvedValue(mockResponse(gzipSync(JSON.stringify([post]))));

    await expect(getPostsForDate("2014-07-04")).resolves.toEqual([post]);
    await expect(getPostsForDate("2014-07-04")).resolves.toEqual([post]);

    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(mockedFetch).toHaveBeenCalledWith(
      "https://archive.example.com/dates/2014-07-04.json.gz",
      expect.objectContaining({ cache: "force-cache" })
    );
    expect(mockedDatabaseRead).not.toHaveBeenCalled();
  });

  it("uses the database when object storage is not configured", async () => {
    mockedDatabaseRead.mockResolvedValue([post]);

    await expect(getPostsForDate("2014-07-04")).resolves.toEqual([post]);

    expect(mockedDatabaseRead).toHaveBeenCalledWith("2014-07-04");
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("uses the database only when the explicit fallback flag is enabled", async () => {
    process.env.ARCHIVE_BASE_URL = "https://archive.example.com";
    process.env.ARCHIVE_DATABASE_FALLBACK = "true";
    mockedFetch.mockResolvedValue(mockResponse(Buffer.alloc(0), 503));
    mockedDatabaseRead.mockResolvedValue([post]);
    const warning = jest.spyOn(console, "warn").mockImplementation(() => undefined);

    await expect(getPostsForDate("2014-07-04")).resolves.toEqual([post]);

    expect(mockedDatabaseRead).toHaveBeenCalledWith("2014-07-04");
    warning.mockRestore();
  });

  it("fails closed when an object is unavailable and fallback is disabled", async () => {
    process.env.ARCHIVE_BASE_URL = "https://archive.example.com";
    mockedFetch.mockResolvedValue(mockResponse(Buffer.alloc(0), 404));

    await expect(getPostsForDate("2014-07-04")).rejects.toThrow("status 404");
    expect(mockedDatabaseRead).not.toHaveBeenCalled();
  });

  it("rejects objects whose posts do not match the requested date", async () => {
    process.env.ARCHIVE_BASE_URL = "https://archive.example.com";
    mockedFetch.mockResolvedValue(
      mockResponse(Buffer.from(JSON.stringify([{ ...post, created_date: "2014-07-05" }])))
    );

    await expect(getPostsForDate("2014-07-04")).rejects.toThrow("invalid shape");
  });
});
