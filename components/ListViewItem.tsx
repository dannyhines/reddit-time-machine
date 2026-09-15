// ListViewItem.tsx
import { List, Avatar, Card } from "antd";
import React from "react";
import { getRedditPermalinkUrl, normalizePostUrl } from "../utils/postUrl";
import { LinkWithAnalytics } from "./LinkWithAnalytics";
import { Post } from "../types/Post";
import useWindowDimensions from "../hooks/useWindowDimensions";

const ListViewItem: React.FC<{ post: Post; contentOnly?: boolean }> = ({ post, contentOnly }) => {
  const { isMobile } = useWindowDimensions();
  const redditUrl = getRedditPermalinkUrl(post.permalink);
  const postUrl = normalizePostUrl(post.url, post.permalink);

  const thumbnail = React.useMemo(() => {
    const imgResolutions = post.preview?.images[0].resolutions ?? [];
    const thumbnailUrl =
      post.thumbnail && post.thumbnail !== "default" ? post.thumbnail.replace("http://", "https://") : undefined;
    const previewUrl = imgResolutions && imgResolutions.length ? imgResolutions[0].url : undefined;
    return thumbnailUrl ?? previewUrl ?? "default_thumbnail.png";
  }, [post]);

  const content = (
    <List.Item key={post.id}>
      <List.Item.Meta
        avatar={<Avatar shape='square' src={thumbnail} size='large' alt={post.title} />}
        title={
          <LinkWithAnalytics
            url={postUrl}
            text={post.title}
            type={postUrl === redditUrl ? "reddit" : "external"}
            fontSize={isMobile ? 12 : undefined}
          />
        }
        description={
          <LinkWithAnalytics
            url={redditUrl}
            text={`r/${post.subreddit} · ${post.author} · ${post.score?.toString()} pts`}
            type='reddit'
            fontSize={isMobile ? 10 : undefined}
          />
        }
      />
    </List.Item>
  );

  return contentOnly ? (
    content
  ) : (
    <Card
      style={{ textAlign: "left", marginBottom: 10, overflow: "hidden", borderColor: "#292f33", borderRadius: 12 }}
      bodyStyle={{ padding: "6px 10px" }}
    >
      {content}
    </Card>
  );
};

export default ListViewItem;
