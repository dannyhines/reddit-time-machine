import { fireEvent, render, screen } from "@testing-library/react";
import ImageCard from "./ImageCard";
import { Post } from "../types/Post";

const post: Post = {
  id: "post-1",
  title: "The card survives broken images",
  url: "https://i.redd.it/original.jpg",
  created_utc: 0,
  author: "author",
  domain: "i.redd.it",
  score: 1234,
  permalink: "/r/pics/comments/post-1",
  subreddit: "pics",
  thumbnail: "https://b.thumbs.redditmedia.com/thumb.jpg",
  thumbnail_height: 50,
  thumbnail_width: 100,
  created_date: "2020-01-01",
  post_type: "pics",
  preview: {
    images: [
      {
        resolutions: [],
        source: { url: "https://preview.redd.it/image.jpg?x=1&amp;y=2", width: 100, height: 50 },
      },
    ],
  },
};

describe("ImageCard", () => {
  it("tries each image candidate and preserves post text when all images fail", () => {
    render(<ImageCard post={post} maxWidth={400} loading={false} />);

    expect(screen.getByText(post.title)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: post.title })).toHaveAttribute(
      "src",
      "https://preview.redd.it/image.jpg?x=1&y=2"
    );

    fireEvent.error(screen.getByRole("img", { name: post.title }));
    expect(screen.getByRole("img", { name: post.title })).toHaveAttribute("src", "https://i.redd.it/original.jpg");

    fireEvent.error(screen.getByRole("img", { name: post.title }));
    expect(screen.getByRole("img", { name: post.title })).toHaveAttribute("src", post.thumbnail);

    fireEvent.error(screen.getByRole("img", { name: post.title }));
    expect(screen.queryByRole("img", { name: post.title })).not.toBeInTheDocument();
    expect(screen.getByText(post.title)).toBeInTheDocument();
    expect(screen.getByText(/r\/pics/)).toBeInTheDocument();
  });
});
