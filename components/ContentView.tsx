import React, { useEffect, useState } from "react";
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
import useWindowDimensions from "../hooks/useWindowDimensions";
import ListViewItem from "./ListViewItem";
import { Post } from "../types/Post";
import Masonry from "react-masonry-css";

interface ContentViewProps {
  initialDate?: string;
  posts: Post[];
}

const ContentView: React.FC<ContentViewProps> = (props) => {
  const { initialDate, posts } = props;
  const { date, handleDateChanged } = useDateSelection(initialDate);
  const { dateObj, stringDate, shortDate } = getDates(date);
  const { loading, politics, news, sports, picsAndMemes, allPosts } = useFetchPosts(date, posts);

  const { predictions } = useFetchPredictions(date);
  const { cardRef, cardWidth } = useCardWidth();
  const { isMobile } = useWindowDimensions();

  const Predictions =
    predictions.length === 0 ? null : (
      <>
        <ListView title={`Predictions in ${getMonthAndYear(dateObj)}`} posts={predictions} loading={loading} />
        <br />
      </>
    );

  return (
    <main className={styles.main}>
      <div className={styles.content_view}>
        <BackTop />

        <DateSelectionView handleSubmit={handleDateChanged} showingDate={date} loading={loading} />

        <div style={{ textAlign: "center", paddingTop: 16, minHeight: 100 }}>
          <div style={{ backgroundColor: "#000", position: "sticky", top: 0, zIndex: 1000 }}>
            <Divider style={{ borderTopColor: "#636363", background: "#050505" }}>
              <h2>{stringDate}</h2>
            </Divider>
          </div>

          {loading ? (
            <Spin size='large' spinning={true} />
          ) : (
            <Row gutter={16} justify='center' ref={cardRef}>
              {isMobile ? (
                <Col span={24}>
                  {allPosts.map((p) =>
                    p.post_type === "pics" || p.post_type == "meme" || p.preview ? (
                      <ImageCard key={p.id} post={p} maxWidth={cardWidth} loading={loading} />
                    ) : (
                      <ListViewItem key={p.id} post={p} />
                    )
                  )}
                  {Predictions}
                </Col>
              ) : (
                <>
                  <Col lg={{ span: 8, order: 1 }} span={24} order={1}>
                    <ListView title={`News on ${shortDate}`} posts={news} loading={loading} />
                    <br />
                    {Predictions}

                    <ListView title={`Politics on ${shortDate}`} posts={politics} loading={loading} />
                    <br />

                    <ListView title={`Sports on ${shortDate}`} posts={sports} loading={loading} />
                  </Col>

                  <Col lg={16} span={24} order={2}>
                    <ListTitle>Pictures and Memes</ListTitle>

                    <Masonry
                      breakpointCols={2}
                      className='my-masonry-grid'
                      columnClassName='my-masonry-grid_column'
                      style={{ textAlign: "center" }}
                    >
                      {picsAndMemes
                        .filter((x) => !!x && x.url.length)
                        .map((item) => (
                          <ImageCard key={item.id} post={item} maxWidth={cardWidth} loading={loading} />
                        ))}
                    </Masonry>
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
