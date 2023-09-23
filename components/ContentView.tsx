import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackTop, Row, Col, Spin, Divider } from "antd";
import DateSelectionView from "./DateSelector";
import ListView from "./ListView";
import { Post } from "../types/Post";
import ImageCard from "./ImageCard";
import styles from "../styles/Home.module.css";
import ListTitle from "./ListTitle";
import Head from "next/head";
import { getApiUrls } from "../utils/getApiUrls";
import { useRouter } from "next/router";
import getRandomDate from "./DateSelector/getRandomDate";
import { getDates } from "../utils/getDates";

interface ContentViewProps {
  initialDate?: string;
}

const ContentView: React.FC<ContentViewProps> = (props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // const [loadingState, setLoadingState] = useState({ news: false, memes: false, pics: false });
  const [startDate, setStartDate] = useState<string>(props.initialDate ?? getRandomDate().format("YYYY-MM-DD"));
  const [news, setNews] = useState<Post[]>([]);
  const [memes, setMemes] = useState<Post[]>([]);
  const [pics, setPics] = useState<Post[]>([]);
  const [politics, setPolitics] = useState<Post[]>([]);
  const [predictions, setPredictions] = useState<Post[]>([]);
  const [science, setScience] = useState<Post[]>([]);
  const { dateObj, stringDate, shortDate } = getDates(startDate);

  useEffect(() => {
    // Either use the date from the 'd' url query param, or random
    if (!props.initialDate) {
      const newDate = getRandomDate().format("YYYY-MM-DD");
      router.push(`/${newDate}`, undefined, { shallow: true });
      setStartDate(newDate);
    }
  }, []);

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
      const { url, predictionsUrl } = getApiUrls(startDate);
      try {
        const response = await fetch(url);
        const data: Post[] = await response.json();
        setMemes(data.filter((x) => x.post_type === "meme").slice(0, 8));
        setPolitics(data.filter((x) => x.post_type === "politics").slice(0, 6));
        setNews(data.filter((x) => x.post_type === "news").slice(0, 8));
        setPics(data.filter((x) => x.post_type === "pics").slice(0, 8));
        setScience(data.filter((x) => x.post_type === "science").slice(0, 6));

        // Only fetch predictions if posts are 2+ years old
        // if (startDate + TWO_YEARS_IN_SECONDS < new Date().getTime()) {
        //   const predictionsResponse = await fetch(predictionsUrl);
        //   const predictionsJson = await predictionsResponse.json();
        //   setPredictions(predictionsJson.data.slice(0, 6));
        // }
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
  const [cardWidth, setcardWidth] = useState(200);
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
    <div>
      <Head>
        <title>Reddit Time Machine</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.content_view}>
          <BackTop />

          <DateSelectionView handleSubmit={handleDateChanged} showingDate={startDate} />

          <div style={{ textAlign: "center", paddingTop: 16, minHeight: 500 }}>
            <Divider style={{ borderTopColor: "#636363" }}>
              <h2>{stringDate}</h2>
            </Divider>
            <Row gutter={16} justify='center'>
              <Col lg={{ span: 8, order: 1 }} span={24} order={1} xs={{ order: 3 }}>
                <ListView title={`News on ${shortDate}`} posts={news} loading={loading} />
                <br />
                {/* {dateObj.isBefore(new Date().getFullYear().toString()) ? (
                  <>
                    <ListView
                      title={`Predictions${predictions.length ? " on " + shortDate : ""}`}
                      posts={predictions}
                      loading={loading}
                    />
                    <br />
                  </>
                ) : null} */}

                <ListView title={`Politics on ${shortDate}`} posts={politics} loading={loading} />
                <br />

                <ListView title={`Science on ${shortDate}`} posts={science} loading={loading} />
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentView;
