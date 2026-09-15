import { getRedditPermalinkUrl, normalizePostUrl } from "./postUrl";

const permalink = "/r/politics/comments/example";
const fallbackUrl = "https://reddit.com/r/politics/comments/example";

describe("post URL normalization", () => {
  it.each(["https://example.com/story", "http://example.com/story?source=reddit"]) 
    ("preserves valid absolute HTTP URLs", (url) => {
      expect(normalizePostUrl(url, permalink)).toBe(url);
    });

  it.each([
    ["/r/politics/comments/example", "https://reddit.com/r/politics/comments/example"],
    ["/comments/example", "https://reddit.com/comments/example"],
    ["/gallery/example", "https://reddit.com/gallery/example"],
  ])("resolves relative Reddit path %s", (url, expected) => {
    expect(normalizePostUrl(url, permalink)).toBe(expected);
  });

  it.each([null, "", "https://", "javascript:alert(1)", "data:text/html,unsafe", "//example.com/post"])(
    "falls back for missing, malformed, and unsafe URLs: %s",
    (url) => {
      expect(normalizePostUrl(url, permalink)).toBe(fallbackUrl);
    }
  );

  it("uses Reddit as a safe last resort when the permalink is malformed", () => {
    expect(getRedditPermalinkUrl("javascript:alert(1)")).toBe("https://reddit.com");
  });
});
