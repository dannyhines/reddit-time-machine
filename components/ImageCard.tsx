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
    return { fontSize: isMobile ? smallFont : 15, lineHeight: 1.35, margin: 0, color: "inherit" };
  };
  const subtitleStyle = (smallFont: number) => {
    return { fontSize: isMobile ? smallFont : 12, lineHeight: 1.3, margin: "4px 0 0", color: "inherit", opacity: 0.68 };
  };

  return (
    <Card
      style={{
        maxWidth,
        margin: "8px 0 12px",
        overflow: "hidden",
        border: "1px solid #292f33",
        padding: 0,
        borderRadius: 16,
        background: "#111315",
      }}
      cover={image ? (
        <Image
          alt={post.title}
          src={image.src}
          srcSet={image.srcSet}
          onError={() => setImageState({ postId: post.id, index: imageIndex + 1 })}
          style={{
            maxWidth,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            maxHeight: 550,
            objectFit: "cover",
            aspectRatio: image.aspectRatio,
          }}
          width='100%'
          height='auto'
          preview={{ src: image.previewUrl }}
        />
      ) : undefined}
      bodyStyle={{ padding: "9px 10px 10px" }}
    >
      <a
        href={REDDIT_BASE_URL + post.permalink}
        target='_blank'
        rel='noopener noreferrer'
        onClick={() => sendLinkClickToGA("reddit", REDDIT_BASE_URL + post.permalink)}
      >
        <Meta
          style={{ padding: 0 }}
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
