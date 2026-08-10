import React, { useMemo, useState } from "react";
import { Card, Image } from "antd";
import { Post } from "../types/Post";
import { sendLinkClickToGA } from "../utils/googleAnalytics";
import { REDDIT_BASE_URL } from "../utils/constants";
import { getImageCandidates } from "../utils/getImageUrls";
import { LoadingCard } from "./LoadingCard";
import dayjs from "dayjs";
import { formatScore } from "../utils/postHelpers";
import useWindowDimensions from "../hooks/useWindowDimensions";
const { Meta } = Card;

interface CardViewProps {
  post?: Post;
  maxWidth: number;
  loading: boolean;
  showDate?: boolean;
}

const ImageCard: React.FC<CardViewProps> = (props) => {
  const { post, maxWidth, loading, showDate } = props;

  const imageCandidates = useMemo(() => getImageCandidates(post), [post]);
  const [imageState, setImageState] = useState({ postId: post?.id, index: 0 });
  const imageIndex = imageState.postId === post?.id ? imageState.index : 0;
  const image = imageCandidates[imageIndex];
  const { isMobile } = useWindowDimensions();

  if (!post || loading) return <LoadingCard />;

  const titleStyle = (smallFont: number) => {
    return { fontSize: isMobile ? smallFont : 16, margin: isMobile ? 0 : 4, color: "inherit" };
  };
  const subtitleStyle = (smallFont: number) => {
    return { fontSize: isMobile ? smallFont : 12, color: "inherit" };
  };

  return (
    <Card
      style={{
        maxWidth,
        margin: "16px 0",
        border: "1px solid #262626",
        padding: 1,
        borderRadius: "8px",
      }}
      cover={image ? (
        <Image
          alt={post.title}
          src={image.src}
          srcSet={image.srcSet}
          onError={() => setImageState({ postId: post.id, index: imageIndex + 1 })}
          style={{
            maxWidth,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            maxHeight: 550,
            objectFit: "cover",
            aspectRatio: image.aspectRatio,
            border: "1px solid #262626",
          }}
          width='100%'
          height='auto'
          preview={{ src: image.previewUrl }}
        />
      ) : undefined}
      bodyStyle={{ padding: "12px 0", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
    >
      <a
        href={REDDIT_BASE_URL + post.permalink}
        target='_blank'
        rel='noopener noreferrer'
        onClick={() => sendLinkClickToGA("reddit", REDDIT_BASE_URL + post.permalink)}
      >
        <Meta
          style={{ padding: isMobile ? 0 : 8 }}
          title={<p style={titleStyle(12)}>{post.title}</p>}
          description={
            <p style={subtitleStyle(10)}>{`r/${post.subreddit} · ${formatScore(post.score)} pts ${
              showDate ? " · " + dayjs(post.created_date).format("M/D/YY") : ""
            }`}</p>
          }
        />
      </a>
    </Card>
  );
};

export default ImageCard;
