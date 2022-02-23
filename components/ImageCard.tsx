import React from "react";
import { Card, Image, Skeleton } from "antd";
import { Post } from "../types/Post";
import { useImage } from "../utils/useImage";
import useWindowDimensions from "../utils/useWindowDimensions";
const { Meta } = Card;

interface CardViewProps {
  post?: Post;
}

const LoadingCard = () => {
  const { width } = useWindowDimensions();
  const imgWidth = width >= 1024 ? 300 : 140;
  const imgHeight = width >= 1024 ? 200 : 120;
  return (
    <Card
      style={{ maxWidth: 400, margin: "16px 0" }}
      bodyStyle={{ padding: 12 }}
    >
      <div style={{ width: "100%", opacity: 0.7 }}>
        <Skeleton.Image style={{ width: imgWidth, height: imgHeight }} />
      </div>
      <Meta description={<Skeleton active />} />
    </Card>
  );
};

const ImageCard: React.FC<CardViewProps> = (props) => {
  const { post } = props;
  if (!post) {
    return <LoadingCard />;
  }
  /* eslint-disable */
  const { hasError, hasStartedInitialFetch, hasLoaded } = useImage(post.url);
  if (hasError) return null;
  if (hasStartedInitialFetch && !hasLoaded) {
    return <LoadingCard />;
  }
  return (
    <Card
      hoverable
      style={{ maxWidth: 400, margin: "16px 0" }}
      cover={
        <Image
          alt="Failed to load image"
          src={post.url}
          style={{ maxHeight: 440 }}
        />
      }
      bodyStyle={{ padding: 12 }}
    >
      <a href={post.full_link} target="_blank" rel="noopener noreferrer">
        <Meta
          title={post.title}
          description={`r/${post.subreddit} · ${post.score} pts`}
        />
      </a>
    </Card>
  );
};

export default ImageCard;
