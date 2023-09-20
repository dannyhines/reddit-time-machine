import React, { useEffect, useRef, useState } from "react";
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
  initialDate: number;
}

const ContentView: React.FC<ContentViewProps> = (props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // const [loadingState, setLoadingState] = useState({ news: false, memes: false, pics: false });
  const [startDate, setStartDate] = useState<number>(props.initialDate);
  const [news, setNews] = useState<Post[]>([]);
  const [memes, setMemes] = useState<Post[]>([]);
  const [pics, setPics] = useState<Post[]>([]);
  const [politics, setPolitics] = useState<Post[]>([]);
  const [predictions, setPredictions] = useState<Post[]>([]);

  const { dateObj, stringDate, shortDate } = getDates(startDate);

  useEffect(() => {
    // Either use the date from the 'd' url query param, or random
    if (!props.initialDate) {
      const newDate = getRandomDate().unix();
      router.push(`/?d=${newDate}`, undefined, { shallow: true });
      setStartDate(newDate);
    }
  }, []);

  const handleDateChanged = (x: number) => {
    router.push(`/?d=${x}`, undefined, { shallow: true });
    setStartDate(x);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { url, predictionsUrl } = getApiUrls(startDate);
      try {
        fetch(url)
          .then((response) => response.json())
          .then((res: Post[]) => {
            console.log("got this back from the API:", res);
            setMemes(res.filter((x: Post) => x.post_type === "meme").slice(0, 8));
            setPolitics(res.filter((x: Post) => x.post_type === "politics").slice(0, 8));
            setNews(res.filter((x: Post) => x.post_type === "news").slice(0, 8));
            setPics(res.filter((x: Post) => x.post_type === "pics").slice(0, 8));
            setPredictions(res.filter((x: Post) => x.post_type === "science").slice(0, 8));
            setLoading(false);
          })
          .catch((err) => {
            console.log("ERROR fetching posts:", err);
          })
          .finally(() => {
            setLoading(false);
          });

        // Only fetch predictions if posts are 2+ years old
        // const twoYears = 63113852;
        // if (startDate + twoYears < new Date().getTime()) {
        //   const predicitonsResponse = await fetch(predictionsUrl);
        //   const predictionsJson = await predicitonsResponse.json();
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

  const LoadingImageCards = [0, 1, 2, 3, 4, 5].map((value, i) => (
    <ImageCard key={i} post={undefined} maxWidth={cardWidth} loading={loading} />
  ));

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
                {dateObj.isBefore(new Date().getFullYear().toString()) ? (
                  <>
                    <ListView
                      title={`Predictions${predictions.length ? " on " + shortDate : ""}`}
                      posts={predictions}
                      loading={loading}
                    />
                    <br />
                  </>
                ) : null}

                <ListView title={`Politics on ${shortDate}`} posts={politics} loading={loading} />
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
