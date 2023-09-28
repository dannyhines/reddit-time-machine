import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackTop, Row, Col, Divider, Spin } from "antd";
import DateSelectionView from "./DateSelector";
import ListView from "./ListView";
import { Post } from "../types/Post";
import ImageCard from "./ImageCard";
import styles from "../styles/Home.module.css";
import ListTitle from "./ListTitle";
import { getApiUrls } from "../utils/getApiUrls";
import { useRouter } from "next/router";
import getRandomDate from "./DateSelector/getRandomDate";
import { getDates, getMonthAndYear } from "../utils/date-util";
import dayjs from "dayjs";

interface ContentViewProps {
  initialDate?: string;
}

const ContentView: React.FC<ContentViewProps> = (props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>(props.initialDate ?? getRandomDate().format("YYYY-MM-DD"));
  const [news, setNews] = useState<Post[]>([]);
  const [memes, setMemes] = useState<Post[]>([]);
  const [pics, setPics] = useState<Post[]>([]);
  const [politics, setPolitics] = useState<Post[]>([]);
  const [predictions, setPredictions] = useState<Post[]>([]);
  // const [science, setScience] = useState<Post[]>([]);
  const [sports, setSports] = useState<Post[]>([]);

  const { dateObj, stringDate, shortDate } = getDates(startDate);

  const handleDateChanged = useCallback(
    (x: string) => {
      router.push(`/${x}`, undefined, { shallow: true });
      setStartDate(x);
    },
    [router]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/posts?date=${startDate}`);
        const data: Post[] = await response.json();
        setMemes(data.filter((x) => x.post_type === "meme").slice(0, 10));
        setPolitics(data.filter((x) => x.post_type === "politics").slice(0, 5));
        setNews(data.filter((x) => x.post_type === "news").slice(0, 8));
        setPics(data.filter((x) => x.post_type === "pics").slice(0, 9));
        // setScience(data.filter((x) => x.post_type === "science").slice(0, 6));
        setSports(data.filter((x) => x.post_type === "sports").slice(0, 5));

        // Only fetch predictions if posts are 2+ years old
        if (dateObj.add(2, "year").isBefore(dayjs())) {
          const from = dateObj.startOf("month").format("YYYY-MM-DD");
          const to = dateObj.add(1, "month").startOf("month").format("YYYY-MM-DD");
          const predictionsResponse = await fetch(`/api/predictions?from=${from}&to=${to}`);
          const predictionPosts = await predictionsResponse.json();
          setPredictions(predictionPosts.slice(0, 6));
        }
      } catch (error) {
        console.log("error fetching posts: ", error);
      } finally {
        setLoading(false);
      }
    };

    // Call the API whenever the startDate changes
    if (startDate) {
      fetchData();
    }
  }, [startDate]);

  // Card width stuff
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setcardWidth] = useState(400);

  useEffect(() => {
    function handleResize() {
      if (cardRef.current) {
        setcardWidth(cardRef.current.offsetWidth);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

        <DateSelectionView handleSubmit={handleDateChanged} showingDate={startDate} />

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
