import React from "react";
import { Card, List, Skeleton } from "antd";
import { Post } from "../types/Post";
import ListTitle from "./ListTitle";
import ListViewItem from "./ListViewItem";

interface ListViewProps {
  title: string;
  posts: Post[];
  loading: boolean;
}
const ListView = React.memo(({ title, posts, loading }: ListViewProps) => {
  const LoadingListView = React.useMemo(
    () => [0, 1, 2, 3, 4, 5].map((value, i) => <Skeleton key={i} active avatar />),
    []
  );

  return (
    <React.Fragment>
      <ListTitle>{title}</ListTitle>

      <Card style={{ textAlign: "left" }} bodyStyle={{ padding: 12 }}>
        {loading && LoadingListView}
        <List
          itemLayout='horizontal'
          dataSource={posts}
          locale={{ emptyText: `No ${title} to show` }}
          renderItem={(post) => <ListViewItem post={post} />}
        />
      </Card>
    </React.Fragment>
  );
});

ListView.displayName = "ListView";

export default ListView;
