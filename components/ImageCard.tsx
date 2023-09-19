import React from "react";
import { Card, Image, Skeleton } from "antd";
import { Post } from "../types/Post";
import { useImage } from "../utils/useImage";
import useWindowDimensions from "../utils/useWindowDimensions";
import { sendLinkClickToGA } from "../utils/googleAnalytics";
import { REDDIT_BASE_URL } from "../utils/constants";
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
      <Meta description={<Skeleton active />} />
    </Card>
  );
};

const ImageCard: React.FC<CardViewProps> = (props) => {
  const { isMobile } = useWindowDimensions();
  const { post, maxWidth, loading } = props;
  const { imgUrl, thumbnailUrl, imgUrlSmall, aspectRatio } = getImageUrls(post);
  const imgState = useImage(post ? imgUrl : undefined);

  if (!post || loading) {
    return <LoadingCard />;
  }
  /* eslint-disable */
  if (imgState.hasError) return null;
  // if (imgState.hasStartedInitialFetch && !imgState.hasLoaded) {
  //   return <LoadingCard />;
  // }

  const titleStyle = (smallFont: number) => {
    return { fontSize: maxWidth < 300 ? smallFont : 14, margin: maxWidth < 300 ? 0 : 4, color: "inherit" };
  };

  const subtitleStyle = (smallFont: number) => {
    return { fontSize: maxWidth < 300 ? smallFont : 12, margin: maxWidth < 300 ? 0 : "0 0 0 8px", color: "inherit" };
  };

  // const imgResolutions = post.preview?.images[0].resolutions ?? [];
  // const imgSource = post.preview?.images[0].source;
  // const thumbnailUrl = post.thumbnail && post.thumbnail !== "default" ? post.thumbnail : undefined;
  // const smallestPreviewUrl = imgResolutions && imgResolutions.length ? imgResolutions[0].url : undefined;
  // const placeholderUrl = smallestPreviewUrl ?? thumbnailUrl;

  return (
    <Card
      hoverable
      style={{ maxWidth, maxHeight: 540, margin: "16px 0" }}
      cover={
        <Image
          alt={post.title}
          src={isMobile ? imgUrlSmall ?? thumbnailUrl ?? imgUrl : imgUrl}
          style={{ height: "auto", maxWidth }}
          width='100%'
          // height={Math.min(imgSource.height, 420)}
          height='auto'
          placeholder={
            imgUrlSmall ? (
              <Image
                preview={false}
                src={imgUrlSmall}
                // width={post.thumbnail_width + "px"}
                width='100%'
                // height={imgSource.height + "px"}
                height='auto'
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
          title={<p style={titleStyle(11)}>{post.title}</p>}
          description={<p style={subtitleStyle(10)}>{`r/${post.subreddit} · ${post.score} pts`}</p>}
        />
      </a>
    </Card>
  );
};

export default ImageCard;
