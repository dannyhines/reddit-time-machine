import React, { useEffect, useState } from "react";
import { BackTop, Row, Col, Spin, Divider } from "antd";
import DateSelectionView from "./DateSelector";
import ListView from "./ListView";
import { Post } from "../types/Post";
import dayjs, { Dayjs } from "dayjs";
import ImageCard from "./ImageCard";
import styles from "../styles/Home.module.css";
import ListTitle from "./ListTitle";
import Head from "next/head";

interface ContentViewProps {}

const ContentView: React.FC<ContentViewProps> = (props) => {
  const [loadingState, setLoadingState] = useState({ news: false, memes: false, pics: false });
  // const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<number>(0);
  const [news, setNews] = useState<Post[]>([]);
  const [memes, setMemes] = useState<Post[]>([]);
  const [pics, setPics] = useState<Post[]>([]);
  const [politics, setPolitics] = useState<Post[]>([]);
  const [predictions, setPredictions] = useState<Post[]>([]);

  function dateChanged(value: number) {
    setStartDate(value);
    setLoadingState({ news: true, memes: true, pics: true });
  }

  useEffect(() => {
    const endDate = (startDate || new Date().getTime()) + 86400; // 1 day
    const oneMonth = 2629743;

    const baseURl = "https://api.pushshift.io/reddit/search/submission/?sort_type=score&sort=desc&size=25";
    const url = baseURl + `&after=${startDate}&before=${endDate}&subreddit=`;
    const predictionsUrl =
      baseURl +
      `&after=${startDate - oneMonth}&before=${
        endDate + oneMonth
      }&subreddit=futurology&q="by%202020"||"by%202021"||"by%202022"`;

    const fetchData = async () => {
      setLoadingState({ news: true, memes: true, pics: true });
      try {
        fetch(url + "news,worldnews,politics")
          .then((response) => response.json())
          .then((res) => {
            setPolitics(res.data.filter((x: Post) => x.subreddit === "politics").slice(0, 6));
            setNews(res.data.filter((x: Post) => x.subreddit === "news" || x.subreddit === "worldnews").slice(0, 8));
          })
          .catch(() => {
            setPolitics([]);
            setNews([]);
          })
          .finally(() => {
            setLoadingState((state) => {
              return { ...state, news: false };
            });
          });

        fetch(url + "memes,memeeconomy,dankmemes,adviceanimals")
          .then((response) => response.json())
          .then((res) => {
            setMemes(res.data.slice(0, 10));
            setLoadingState((state) => {
              return { ...state, memes: false };
            });
          })
          .catch(() => {
            setMemes([]);
          })
          .finally(() => {
            setLoadingState((state) => {
              return { ...state, memes: false };
            });
          });

        fetch(url + "pics")
          .then((response) => response.json())
          .then((res) => {
            setPics(res.data.slice(0, 7));
            setLoadingState((state) => {
              return { ...state, pics: false };
            });
          })
          .catch(() => {
            setPics([]);
          })
          .finally(() => {
            setLoadingState((state) => {
              return { ...state, pics: false };
            });
          });

        // Only fetch predictions if posts are 2+ years old
        const twoYears = 63113852;
        if (startDate + twoYears < new Date().getTime()) {
          const predicitonsResponse = await fetch(predictionsUrl);
          const predictionsJson = await predicitonsResponse.json();
          setPredictions(predictionsJson.data.slice(0, 6));
        }
      } catch (error) {
        console.log("error fetching posts: ", error);
      } finally {
        setLoadingState({ news: false, memes: false, pics: false });
      }
    };

    if (startDate) {
      fetchData();
    }
  }, [startDate]);

  const dateObj: Dayjs = dayjs(startDate * 1000);
  const stringDate = `${getWeekDay(dateObj)},  ${dateObj.format("MMM.")} ${getOrdinalNum(
    dateObj.date()
  )} ${dateObj.year()}`;

  const LoadingImageCards = [0, 1, 2, 3, 4, 5].map((value, i) => <ImageCard key={i} post={undefined} />);

  const shortDate = dateObj.format("M/D/YY");
  return (
    <div>
      <Head>
        <title>Reddit Time Machine - {shortDate}</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.content_view}>
          <BackTop />

          <DateSelectionView handleSubmit={dateChanged} showingDate={dateObj} />

          <div style={{ textAlign: "center", paddingTop: 16, minHeight: 500 }}>
            <Divider style={{ borderTopColor: "#636363" }}>
              <h2>{stringDate}</h2>
            </Divider>

            <Row gutter={16} justify="center">
              <Col lg={8} span={24} sm={{ order: 1 }} xs={{ order: 3 }}>
                <ListView title={`News on ${shortDate}`} posts={news} loading={loadingState.news} />
                <br />
                {dateObj.isBefore(new Date().getFullYear().toString()) ? (
                  <>
                    <ListView title={`Predictions on ${shortDate}`} posts={predictions} loading={loadingState.news} />
                    <br />
                  </>
                ) : null}

                <ListView title={`Politics on ${shortDate}`} posts={politics} loading={loadingState.news} />
              </Col>

              <Col lg={8} span={12} order={2} xs={{ order: 1 }}>
                <ListTitle>Pictures</ListTitle>
                {loadingState.pics
                  ? LoadingImageCards
                  : pics.filter((x) => x.url.length).map((item) => <ImageCard key={item.id} post={item} />)}
              </Col>

              <Col lg={8} span={12} order={3} xs={{ order: 2 }}>
                <ListTitle>Memes</ListTitle>
                {loadingState.memes
                  ? LoadingImageCards
                  : memes.filter((x) => x.url.length).map((item) => <ImageCard key={item.id} post={item} />)}
              </Col>
            </Row>
          </div>
        </div>
      </main>
    </div>
  );
};

const getWeekDay = (date: Dayjs) => {
  var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekday[date.day()];
};

function getOrdinalNum(n: number) {
  return n + (n > 0 ? ["th", "st", "nd", "rd"][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : "");
}

export default ContentView;
