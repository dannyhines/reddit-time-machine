import { Card, Skeleton } from "antd";
import Meta from "antd/lib/card/Meta";
import useWindowDimensions from "../utils/useWindowDimensions";

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
