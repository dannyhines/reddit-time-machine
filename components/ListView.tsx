import React from "react";
import { Avatar, Card, List, Skeleton } from "antd";
import { Post } from "../types/Post";
import ListTitle from "./ListTitle";
import { sendLinkClickToGA } from "../utils/googleAnalytics";
import useWindowDimensions from "../utils/useWindowDimensions";
import { REDDIT_BASE_URL } from "../utils/constants";

interface ListViewProps {
  title: string;
  posts?: Post[];
  loading: boolean;
}

const LinkWithAnalytics = (url: string, text: string, type: "reddit" | "external", fontSize?: number) => {
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      onClick={() => sendLinkClickToGA(type, url)}
      style={{ fontSize, color: "inherit" }}
    >
      {text}
    </a>
  );
};

const ListView: React.FC<ListViewProps> = (props) => {
  const { isMobile } = useWindowDimensions();
  const { title, posts, loading } = props;
  const LoadingListView = [0, 1, 2, 3, 4, 5].map((value, i) => <Skeleton key={i} active avatar />);

  const getThumbnail = (post: Post) => {
    const imgResolutions = post.preview?.images[0].resolutions ?? [];
    const thumbnailUrl = post.thumbnail && post.thumbnail !== "default" ? post.thumbnail : undefined;
    const previewUrl = imgResolutions && imgResolutions.length ? imgResolutions[0].url : undefined;
    return thumbnailUrl ?? previewUrl ?? "default_thumbnail.png";
  };

  return (
    <>
      <ListTitle>{title}</ListTitle>

      <Card style={{ textAlign: "left" }}>
        {loading && LoadingListView}
        <List
          itemLayout='horizontal'
          dataSource={posts}
          locale={{ emptyText: `No ${title} to show` }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar shape='square' src={getThumbnail(item)} size='large' alt={item.title} />}
                title={LinkWithAnalytics(item.url, item.title, "external", isMobile ? 12 : undefined)}
                description={LinkWithAnalytics(
                  REDDIT_BASE_URL + item.permalink,
                  `r/${item.subreddit} · ${item.author} · ${item.score?.toString()} pts`,
                  "reddit",
                  isMobile ? 10 : undefined
                )}
              />
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default ListView;
