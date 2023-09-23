import React from "react";
import { Avatar, Card, List, Skeleton } from "antd";
import { Post } from "../types/Post";
import ListTitle from "./ListTitle";
import { sendLinkClickToGA } from "../utils/googleAnalytics";
import useWindowDimensions from "../utils/useWindowDimensions";
import { REDDIT_BASE_URL } from "../utils/constants";
import { LinkWithAnalytics } from "./LinkWithAnalytics";

interface ListViewProps {
  title: string;
  posts: Post[];
  loading: boolean;
}
const ListView = React.memo(({ title, posts, loading }: ListViewProps) => {
  const { isMobile } = useWindowDimensions();

  const LoadingListView = React.useMemo(
    () => [0, 1, 2, 3, 4, 5].map((value, i) => <Skeleton key={i} active avatar />),
    []
  );

  const getThumbnail = React.useMemo(
    () => (post: Post) => {
      const imgResolutions = post.preview?.images[0].resolutions ?? [];
      const thumbnailUrl =
        post.thumbnail && post.thumbnail !== "default" ? post.thumbnail.replace("http://", "https://") : undefined;
      const previewUrl = imgResolutions && imgResolutions.length ? imgResolutions[0].url : undefined;
      return thumbnailUrl ?? previewUrl ?? "default_thumbnail.png";
    },
    []
  );

  return (
    <React.Fragment>
      <ListTitle>{title}</ListTitle>

      <Card style={{ textAlign: "left" }}>
        {loading && LoadingListView}
        <List
          itemLayout='horizontal'
          dataSource={posts}
          locale={{ emptyText: `No ${title} to show` }}
          renderItem={React.useCallback(
            (item: Post) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={<Avatar shape='square' src={getThumbnail(item)} size='large' alt={item.title} />}
                  title={
                    <LinkWithAnalytics
                      url={item.url}
                      text={item.title}
                      type='external'
                      fontSize={isMobile ? 12 : undefined}
                    />
                  }
                  description={
                    <LinkWithAnalytics
                      url={REDDIT_BASE_URL + item.permalink}
                      text={`r/${item.subreddit} · ${item.author} · ${item.score?.toString()} pts`}
                      type='reddit'
                      fontSize={isMobile ? 10 : undefined}
                    />
                  }
                />
              </List.Item>
            ),
            [getThumbnail, isMobile]
          )}
        />
      </Card>
    </React.Fragment>
  );
});

ListView.displayName = "ListView";

export default ListView;
