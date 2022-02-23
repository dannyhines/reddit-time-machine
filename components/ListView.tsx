import React from "react";
import { Avatar, Card, List, Skeleton } from "antd";
import { Post } from "../types/Post";
import ListTitle from "./ListTitle";

interface ListViewProps {
  title: string;
  posts?: Post[];
  loading: boolean;
}

const ListView: React.FC<ListViewProps> = (props) => {
  const { title, posts, loading } = props;
  const LoadingListView = [0, 1, 2, 3, 4, 5].map((value, i) => (
    <Skeleton key={i} active avatar />
  ));
  return (
    <>
      <ListTitle>{title}</ListTitle>

      <Card style={{ textAlign: "left" }}>
        {loading && LoadingListView}
        <List
          itemLayout="horizontal"
          dataSource={posts}
          locale={{ emptyText: `No ${title} to show` }}
          renderItem={(item) => (
            <a href={item.full_link} target="_blank" rel="noopener noreferrer">
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar shape="square" src={item.thumbnail} size="large" />
                  }
                  title={<a href={item.url}>{item.title}</a>}
                  description={`r/${item.subreddit} · ${
                    item.author
                  } · ${item.score?.toString()} pts`}
                />
              </List.Item>
            </a>
          )}
        />
      </Card>
    </>
  );
};

export default ListView;
