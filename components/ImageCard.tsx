import React, { useEffect, useState } from "react";
import { Card, Image, Skeleton } from "antd";
import { Post } from "../types/Post";
import { useImage } from "../utils/useImage";
import useWindowDimensions from "../utils/useWindowDimensions";
import { sendLinkClickToGA } from "../utils/googleAnalytics";
// import Image from "next/image";
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
  const imgState = useImage(post ? post.url : undefined);
  if (!post) {
    return <LoadingCard />;
  }
  // useEffect(() => {
  //   setimageState(newImgState);
  // }, [useImage, post.url]);

  /* eslint-disable */
  if (imgState.hasError) return null;
  // if (imgState.hasStartedInitialFetch && !imgState.hasLoaded) {
  //   return <LoadingCard />;
  // }

  const titleStyle = (smallFont: number) => {
    return { fontSize: isMobile ? smallFont : 16, margin: isMobile ? 0 : 4, color: "inherit" };
  };

  const subtitleStyle = (smallFont: number) => {
    return { fontSize: isMobile ? smallFont : 13, margin: isMobile ? 0 : "0 0 0 8px", color: "inherit" };
  };

  const imgResolutions = post.preview?.images.resolutions ?? [];
  const thumbnailUrl = post.thumbnail && post.thumbnail !== "default" ? post.thumbnail : undefined;
  const biggestPreviewUrl =
    imgResolutions && imgResolutions.length ? imgResolutions[imgResolutions.length - 1].url : undefined;
  const placeholderUrl = biggestPreviewUrl ?? thumbnailUrl;
  return (
    <Card
      hoverable
      style={{ maxWidth: 400, maxHeight: 540, margin: "16px 0" }}
      cover={
        <Image
          alt="Failed to load image"
          // onError={(err) => console.log(err)}
          src={post.url}
          style={{ maxHeight: 420 }}
          placeholder={
            placeholderUrl ? <Image preview={false} src={placeholderUrl} width="100%" height="100%" /> : null
          }
          preview={{ src: post.url }}
        />
      }
      bodyStyle={{ padding: 12 }}
    >
      <a
        href={post.full_link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => sendLinkClickToGA("reddit", post.full_link)}
      >
        <Meta
          title={<p style={titleStyle(12)}>{post.title}</p>}
          description={<p style={subtitleStyle(10)}>{`r/${post.subreddit} · ${post.score} pts`}</p>}
        />
      </a>
    </Card>
  );
};

export default ImageCard;
