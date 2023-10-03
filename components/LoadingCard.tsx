import { Card, Skeleton } from "antd";
import Meta from "antd/lib/card/Meta";
import useWindowDimensions from "../utils/useWindowDimensions";
import { REDDIT_BASE_URL } from "../utils/constants";
import { sendLinkClickToGA } from "../utils/googleAnalytics";
import { Post } from "../types/Post";

export const LoadingCard = () => {
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

export const LoadingImage = (props: { post: Post; maxWidth: number; titleStyle: any; subtitleStyle: any }) => {
  const { post, maxWidth, titleStyle, subtitleStyle } = props;
  const { isDesktop } = useWindowDimensions();
  const imgWidth = isDesktop ? 300 : 140;
  const imgHeight = isDesktop ? 200 : 120;

  return (
    <Card
      style={{ maxWidth, margin: "16px 0" }}
      cover={
        <div style={{ width: "100%", opacity: 0.7 }}>
          <Skeleton.Image style={{ width: imgWidth, height: imgHeight }} />
        </div>
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
