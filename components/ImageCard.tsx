import React from "react";
import { Card, Image, Skeleton } from "antd";
import { Post } from "../types/Post";
import { useImage } from "../utils/useImage";
import useWindowDimensions from "../utils/useWindowDimensions";
import { sendLinkClickToGA } from "../utils/googleAnalytics";
const { Meta } = Card;

interface CardViewProps {
  post?: Post;
}

const LoadingCard = () => {
  const { isDesktop } = useWindowDimensions();
  const imgWidth = isDesktop ? 300 : 140;
  const imgHeight = isDesktop ? 200 : 120;
  return (
    <Card style={{ maxWidth: 400, margin: "16px 0" }} bodyStyle={{ padding: 12 }}>
      <div style={{ width: "100%", opacity: 0.7 }}>
        <Skeleton.Image style={{ width: imgWidth, height: imgHeight }} />
      </div>
      <Meta description={<Skeleton active />} />
    </Card>
  );
};

const ImageCard: React.FC<CardViewProps> = (props) => {
  const { isMobile } = useWindowDimensions();
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

  const textStyle = (smallFont: number) => {
    return { fontSize: isMobile ? smallFont : undefined, margin: isMobile ? 0 : undefined, color: "inherit" };
  };

  return (
    <Card
      hoverable
      style={{ maxWidth: 400, margin: "16px 0" }}
      cover={<Image alt="Failed to load image" src={post.url} style={{ maxHeight: 440 }} />}
      bodyStyle={{ padding: 12 }}
    >
      <a
        href={post.full_link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => sendLinkClickToGA("reddit", post.full_link)}
      >
        <Meta
          title={<p style={textStyle(12)}>{post.title}</p>}
          description={<p style={textStyle(10)}>{`r/${post.subreddit} · ${post.score} pts`}</p>}
        />
      </a>
    </Card>
  );
};

export default ImageCard;
