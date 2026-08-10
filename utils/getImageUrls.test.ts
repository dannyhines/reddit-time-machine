import { Post } from "../types/Post";
import { getImageCandidates, normalizeRedditImageUrl } from "./getImageUrls";

const post: Post = {
  id: "post-1",
  title: "A post",
  url: "http://i.redd.it/original.jpg?width=100&amp;crop=smart",
  created_utc: 0,
  author: "author",
  domain: "i.redd.it",
  score: 10,
  permalink: "/r/pics/comments/post-1",
  subreddit: "pics",
  thumbnail: "http://b.thumbs.redditmedia.com/thumb.jpg",
  thumbnail_height: 50,
  thumbnail_width: 100,
  created_date: "2020-01-01",
  post_type: "pics",
  preview: {
    images: [
      {
        resolutions: [{ url: "https://preview.redd.it/image.jpg?width=320&amp;crop=smart", width: 320, height: 180 }],
        source: {
          url: "https://preview.redd.it/image.jpg?width=1080&amp;crop=smart",
          width: 1080,
          height: 607,
        },
      },
    ],
  },
};

describe("getImageCandidates", () => {
  it("decodes HTML-escaped parameters and upgrades legacy HTTP URLs", () => {
    expect(normalizeRedditImageUrl("http://example.com/image?x=1&amp;y=2&#38;z=3&#x26;q=4")).toBe(
      "https://example.com/image?x=1&y=2&z=3&q=4"
    );
  });

  it("orders preview, original, and thumbnail fallbacks and normalizes each URL", () => {
    const candidates = getImageCandidates(post);

    expect(candidates.map(({ src }) => src)).toEqual([
      "https://preview.redd.it/image.jpg?width=1080&crop=smart",
      "https://i.redd.it/original.jpg?width=100&crop=smart",
      "https://b.thumbs.redditmedia.com/thumb.jpg",
    ]);
    expect(candidates[0].srcSet).toBe("https://preview.redd.it/image.jpg?width=320&crop=smart 320w");
  });
});
