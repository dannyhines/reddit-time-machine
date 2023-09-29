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

interface ContentViewProps {
  initialDate?: string;
}

const ContentView: React.FC<ContentViewProps> = (props) => {
  const { date, handleDateChanged } = useDateSelection(props.initialDate);
  const { dateObj, stringDate, shortDate } = getDates(date);

  const { loading, error, memes, politics, news, pics, sports } = useFetchPosts(date);
  const { predictions } = useFetchPredictions(date);

  const { cardRef, cardWidth } = useCardWidth();

  const LoadingImageCards = useMemo(
    () =>
      [0, 1, 2, 3, 4, 5].map((value, i) => (
        <ImageCard key={i} post={undefined} maxWidth={cardWidth} loading={loading} />
      )),
    [cardWidth, loading]
  );

  return (
    <main className={styles.main}>
      <div className={styles.content_view}>
        <BackTop />

        <DateSelectionView handleSubmit={handleDateChanged} showingDate={date} />

        <div style={{ textAlign: "center", paddingTop: 16, minHeight: 500 }}>
          <Divider style={{ borderTopColor: "#636363" }}>
            <h2>{stringDate}</h2>
          </Divider>

          {loading ? (
            <Spin size='large' spinning={true} />
          ) : (
            <Row gutter={16} justify='center'>
              <Col lg={{ span: 8, order: 1 }} span={24} order={1} xs={{ order: 3 }}>
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

              <Col lg={8} span={12} order={2} xs={{ order: 1 }}>
                <div ref={cardRef}>
                  <ListTitle>Pictures</ListTitle>
                  {loading
                    ? LoadingImageCards
                    : pics
                        .filter((x) => x.url.length)
                        .map((item) => <ImageCard key={item.id} post={item} maxWidth={cardWidth} loading={loading} />)}
                </div>
              </Col>

              <Col lg={8} span={12} order={3} xs={{ order: 2 }}>
                <ListTitle>Memes</ListTitle>
                {loading
                  ? LoadingImageCards
                  : memes
                      .filter((x) => x.url.length)
                      .map((item) => <ImageCard key={item.id} post={item} maxWidth={cardWidth} loading={loading} />)}
              </Col>
            </Row>
          )}
        </div>
      </div>
    </main>
  );
};

export default ContentView;
