import React from "react";
import { Card, Image } from "antd";
import { Post } from "../types/Post";
import { useImage } from "../hooks/useImage";
import { sendLinkClickToGA } from "../utils/googleAnalytics";
import { REDDIT_BASE_URL } from "../utils/constants";
import { getImageUrls } from "../utils/getImageUrls";
import { LoadingCard, LoadingImage } from "./LoadingCard";

const { Meta } = Card;

interface CardViewProps {
  post?: Post;
  maxWidth: number;
  loading: boolean;
}

const ImageCard: React.FC<CardViewProps> = (props) => {
  const { post, maxWidth, loading } = props;

  const { aspectRatio, imgSrc, thumbnail, placeholder, srcSet, previewUrl } = getImageUrls(post);
  const { imgHasError, imgHasLoaded, hasStartedInitialFetch } = useImage(imgSrc, srcSet);

  if (!post || loading) return <LoadingCard />;
  if (imgHasError) return null;

  const titleStyle = (smallFont: number) => {
    return { fontSize: maxWidth < 300 ? smallFont : 14, margin: maxWidth < 300 ? 0 : 4, color: "inherit" };
  };
  const subtitleStyle = (smallFont: number) => {
    return { fontSize: maxWidth < 300 ? smallFont : 12, margin: maxWidth < 300 ? 0 : "0 0 0 8px", color: "inherit" };
  };
  if (hasStartedInitialFetch && !imgHasLoaded) {
    return <LoadingImage post={post} maxWidth={maxWidth} titleStyle={titleStyle} subtitleStyle={subtitleStyle} />;
  }

  return (
    <Card
      style={{ maxWidth, margin: "16px 0" }}
      cover={
        <Image
          alt={post.title}
          src={imgSrc ?? thumbnail}
          srcSet={srcSet}
          style={{ maxWidth, maxHeight: 550, objectFit: "cover", aspectRatio }}
          width='100%'
          height='auto'
          placeholder={
            <Image
              preview={false}
              src={placeholder ?? thumbnail}
              style={{ maxWidth, aspectRatio, filter: "blur(5px)" }}
              alt='Loading...'
              width='100%'
              height='auto'
            />
          }
          preview={{ src: previewUrl }}
        />
      }
      bodyStyle={{ padding: "12px 0" }}
    >
      <a
        href={REDDIT_BASE_URL + post.permalink}
        target='_blank'
        rel='noopener noreferrer'
        onClick={() => sendLinkClickToGA("reddit", REDDIT_BASE_URL + post.permalink)}
      >
        <Meta
          title={<p style={titleStyle(10)}>{post.title}</p>}
          description={<p style={subtitleStyle(8)}>{`r/${post.subreddit} · ${post.score} pts`}</p>}
        />
      </a>
    </Card>
  );
};

export default ImageCard;
