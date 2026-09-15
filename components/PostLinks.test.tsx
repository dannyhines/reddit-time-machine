import { render } from "@testing-library/react";
import ImageCard from "./ImageCard";
import ListViewItem from "./ListViewItem";
import { Post } from "../types/Post";

const post: Post = {
  id: "relative-post",
  title: "A relative Reddit link",
  url: "/r/politics/comments/example",
  created_utc: 0,
  author: "author",
  domain: "reddit.com",
  score: 10,
  permalink: "/r/politics/comments/example",
  subreddit: "politics",
  created_date: "2021-01-01",
  post_type: "politics",
};

describe("post link rendering", () => {
  it("never renders relative Reddit href values", () => {
    const { container: listContainer } = render(<ListViewItem post={post} contentOnly />);
    const { container: imageContainer } = render(<ImageCard post={post} maxWidth={400} loading={false} />);

    const expectedUrl = "https://reddit.com/r/politics/comments/example";
    expect(listContainer.innerHTML).not.toContain('href="/r/');
    expect(imageContainer.innerHTML).not.toContain('href="/r/');
    expect(listContainer.querySelector(`a[href="${expectedUrl}"]`)).not.toBeNull();
    expect(imageContainer.querySelector(`a[href="${expectedUrl}"]`)).not.toBeNull();
  });
});
