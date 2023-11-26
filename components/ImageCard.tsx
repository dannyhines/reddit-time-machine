import React from "react";
import { Card, Image } from "antd";
import { Post } from "../types/Post";
import { useImage } from "../hooks/useImage";
import { sendLinkClickToGA } from "../utils/googleAnalytics";
import { REDDIT_BASE_URL } from "../utils/constants";
import { getImageUrls } from "../utils/getImageUrls";
import { LoadingCard, LoadingImage } from "./LoadingCard";
import dayjs from "dayjs";
const { Meta } = Card;

interface CardViewProps {
  post?: Post;
  maxWidth: number;
  loading: boolean;
  showDate?: boolean;
}

const ImageCard: React.FC<CardViewProps> = (props) => {
  const { post, maxWidth, loading, showDate } = props;

  const { aspectRatio, imgSrc, thumbnail, placeholder, srcSet, previewUrl } = getImageUrls(post);
  const { imgHasError, imgHasLoaded, hasStartedInitialFetch } = useImage(imgSrc, srcSet);

  if (!post || loading) return <LoadingCard />;
  if (imgHasError) return null;

  const titleStyle = (smallFont: number) => {
    return { fontSize: maxWidth < 300 ? smallFont : 16, margin: maxWidth < 300 ? 0 : 4, color: "inherit" };
  };
  const subtitleStyle = (smallFont: number) => {
    return { fontSize: maxWidth < 300 ? smallFont : 12, color: "inherit" };
  };
  if (hasStartedInitialFetch && !imgHasLoaded) {
    return <LoadingImage post={post} maxWidth={maxWidth} titleStyle={titleStyle} subtitleStyle={subtitleStyle} />;
  }

  return (
    <Card
      style={{
        maxWidth,
        margin: "16px 0",
        border: "1px solid #262626",
        padding: 1,
        borderRadius: "8px",
      }}
      cover={
        <Image
          alt={post.title}
          src={imgSrc ?? thumbnail}
          srcSet={srcSet}
          style={{
            maxWidth,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            maxHeight: 550,
            objectFit: "cover",
            aspectRatio,
            border: "1px solid #262626",
          }}
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
      bodyStyle={{ padding: "12px 0", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
    >
      <a
        href={REDDIT_BASE_URL + post.permalink}
        target='_blank'
        rel='noopener noreferrer'
        onClick={() => sendLinkClickToGA("reddit", REDDIT_BASE_URL + post.permalink)}
      >
        <Meta
          style={{ padding: 8 }}
          title={<p style={titleStyle(10)}>{post.title}</p>}
          description={
            <p style={subtitleStyle(8)}>{`r/${post.subreddit} · ${post.score} pts ${
              showDate ? " · " + dayjs(post.created_date).format("M/D/YY") : ""
            }`}</p>
          }
        />
      </a>
    </Card>
  );
};

export default ImageCard;
