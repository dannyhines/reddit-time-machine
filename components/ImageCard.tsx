import React from "react";
import { Card, Image, Skeleton } from "antd";
import { Post } from "../types/Post";
import { useImage } from "../utils/useImage";
import useWindowDimensions from "../utils/useWindowDimensions";
import { sendLinkClickToGA } from "../utils/googleAnalytics";
import { DEFAULT_THUMBNAIL, REDDIT_BASE_URL } from "../utils/constants";
import { getImageUrls } from "../utils/getImageUrls";

const { Meta } = Card;

interface CardViewProps {
  post?: Post;
  maxWidth: number;
  loading: boolean;
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
      <br />
      <Meta description={<Skeleton active />} />
    </Card>
  );
};

const ImageCard: React.FC<CardViewProps> = (props) => {
  const { post, maxWidth, loading } = props;
  const { isMobile } = useWindowDimensions();

  const { imgUrl, thumbnailUrl, imgUrlSmall, aspectRatio } = getImageUrls(post);
  const imgState = useImage(post ? imgUrl : undefined);

  if (!post || loading) {
    return <LoadingCard />;
  }

  if (imgState.hasError) {
    return null;
  }

  const titleStyle = (smallFont: number) => {
    return { fontSize: maxWidth < 300 ? smallFont : 14, margin: maxWidth < 300 ? 0 : 4, color: "inherit" };
  };

  const subtitleStyle = (smallFont: number) => {
    return { fontSize: maxWidth < 300 ? smallFont : 12, margin: maxWidth < 300 ? 0 : "0 0 0 8px", color: "inherit" };
  };

  return (
    <Card
      hoverable
      style={{ maxWidth, margin: "16px 0" }}
      cover={
        <Image
          alt={post.title}
          src={isMobile ? imgUrlSmall ?? imgUrl : imgUrl}
          style={{ maxWidth, aspectRatio }}
          width='100%'
          // height={Math.min(imgSource.height, 420)}
          // height='100%'
          placeholder={
            imgUrlSmall ? (
              <Image
                preview={false}
                src={thumbnailUrl ?? DEFAULT_THUMBNAIL}
                width='100%'
                height={200}
                alt='Loading...'
              />
            ) : null
          }
          preview={{ src: imgUrl }}
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
