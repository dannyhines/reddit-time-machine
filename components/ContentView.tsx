import React, { useMemo } from "react";
import { BackTop, Row, Col, Divider, Spin } from "antd";
import DateSelectionView from "./DateSelector";
import ListView from "./ListView";
import ImageCard from "./ImageCard";
import styles from "../styles/Home.module.css";
import ListTitle from "./ListTitle";
import { getDates, getMonthAndYear } from "../utils/date-util";
import { useFetchPosts } from "../hooks/useFetchPosts";
import { useFetchPredictions } from "../hooks/useFetchPredictions";
import { useDateSelection } from "../hooks/useDateSelection";
import { useCardWidth } from "../hooks/useCardWith";
import useWindowDimensions from "../utils/useWindowDimensions";
import ListViewItem from "./ListViewItem";

interface ContentViewProps {
  initialDate?: string;
}

const ContentView: React.FC<ContentViewProps> = (props) => {
  const { date, handleDateChanged } = useDateSelection(props.initialDate);
  const { dateObj, stringDate, shortDate } = getDates(date);
  const { loading, memes, politics, news, pics, sports, allPosts } = useFetchPosts(date);
  const { predictions } = useFetchPredictions(date);
  const { cardRef, cardWidth } = useCardWidth();
  const { isMobile } = useWindowDimensions();

  return (
    <main className={styles.main}>
      <div className={styles.content_view}>
        <BackTop />

        <DateSelectionView handleSubmit={handleDateChanged} showingDate={date} />

        <div style={{ textAlign: "center", paddingTop: 16, minHeight: 100 }}>
          <div style={{ backgroundColor: "#000", position: "sticky", top: 0, zIndex: 1000 }}>
            <Divider style={{ borderTopColor: "#636363" }}>
              <h2>{stringDate}</h2>
            </Divider>
          </div>

          {loading ? (
            <Spin size='large' spinning={true} />
          ) : (
            <Row gutter={16} justify='center'>
              {isMobile ? (
                <Col span={24}>
                  {allPosts.map((p) =>
                    p.post_type === "pics" || p.post_type == "meme" || p.preview ? (
                      <ImageCard key={p.id} post={p} maxWidth={cardWidth} loading={loading} />
                    ) : (
                      <ListViewItem key={p.id} post={p} />
                    )
                  )}
                </Col>
              ) : (
                <>
                  <Col lg={{ span: 8, order: 1 }} span={24} order={1}>
                    <ListView title={`News on ${shortDate}`} posts={news} loading={loading} />
                    <br />
                    {predictions.length ? (
                      <>
                        <ListView
                          title={`Predictions in ${getMonthAndYear(dateObj)}`}
                          posts={predictions}
                          loading={loading}
                        />
                        <br />
                      </>
                    ) : null}

                    <ListView title={`Politics on ${shortDate}`} posts={politics} loading={loading} />
                    <br />

                    <ListView title={`Sports on ${shortDate}`} posts={sports} loading={loading} />
                  </Col>

                  <Col lg={8} span={12} order={2}>
                    <div ref={cardRef}>
                      <ListTitle>Pictures</ListTitle>
                      {pics
                        .filter((x) => x.url.length)
                        .map((item) => (
                          <ImageCard key={item.id} post={item} maxWidth={cardWidth} loading={loading} />
                        ))}
                    </div>
                  </Col>

                  <Col lg={8} span={12} order={3}>
                    <ListTitle>Memes</ListTitle>
                    {memes
                      .filter((x) => x.url.length)
                      .map((item) => (
                        <ImageCard key={item.id} post={item} maxWidth={cardWidth} loading={loading} />
                      ))}
                  </Col>
                </>
              )}
            </Row>
          )}
        </div>
      </div>
    </main>
  );
};

export default ContentView;
