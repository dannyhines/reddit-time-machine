import React, { useEffect, useRef, useState } from 'react';
import { BackTop, Row, Col, Spin, Divider } from 'antd';
import DateSelectionView from './DateSelector';
import ListView from './ListView';
import { Post } from '../types/Post';
import dayjs, { Dayjs } from 'dayjs';
import ImageCard from './ImageCard';
import styles from '../styles/Home.module.css';
import ListTitle from './ListTitle';
import Head from 'next/head';
import { getPushshiftUrls } from '../utils/getPredictionsUrl';
import { useRouter } from 'next/router';
import getRandomDate from './DateSelector/getRandomDate';
import { getDates } from '../utils/getDates';

interface ContentViewProps {
  initialDate: number;
}

const ContentView: React.FC<ContentViewProps> = (props) => {
  const router = useRouter();
  const [loadingState, setLoadingState] = useState({ news: false, memes: false, pics: false });
  // const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    // Call the API whenever the startDate changes
    if (startDate) {
      fetchData();
    }
  }, [startDate]);

  const handleDateChanged = (x: number) => {
    router.push(`/?d=${x}`, undefined, { shallow: true });
    setStartDate(x);
  };

  const fetchData = async () => {
    setLoadingState({ news: true, memes: true, pics: true });
    const { url, predictionsUrl } = getPushshiftUrls(startDate);
    try {
      fetch(url + 'news,worldnews,politics')
        .then((response) => response.json())
        .then((res) => {
          setPolitics(res.data.filter((x: Post) => x.subreddit === 'politics').slice(0, 6));
          setNews(res.data.filter((x: Post) => x.subreddit === 'news' || x.subreddit === 'worldnews').slice(0, 8));
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

      fetch(url + 'memes,memeeconomy,dankmemes,adviceanimals')
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

      fetch(url + 'pics')
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
      console.log('error fetching posts: ', error);
    } finally {
      setLoadingState({ news: false, memes: false, pics: false });
    }
  };

  // Card width stuff
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setcardWidth] = useState(200);
  useEffect(() => {
    function handleResize() {
      if (cardRef.current) {
        setcardWidth(cardRef.current.offsetWidth);
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const LoadingImageCards = [0, 1, 2, 3, 4, 5].map((value, i) => (
    <ImageCard key={i} post={undefined} maxWidth={cardWidth} />
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

          <div style={{ textAlign: 'center', paddingTop: 16, minHeight: 500 }}>
            <Divider style={{ borderTopColor: '#636363' }}>
              <h3>{stringDate}</h3>
            </Divider>

            <Row gutter={16} justify='center'>
              <Col lg={8} span={24} sm={{ order: 1 }} xs={{ order: 3 }}>
                <ListView title={`News on ${shortDate}`} posts={news} loading={loadingState.news} />
                <br />
                {dateObj.isBefore(new Date().getFullYear().toString()) ? (
                  <>
                    <ListView title={`Predictions`} posts={predictions} loading={loadingState.news} />
                    <br />
                  </>
                ) : null}

                <ListView title={`Politics on ${shortDate}`} posts={politics} loading={loadingState.news} />
              </Col>

              <Col lg={8} span={12} order={2} xs={{ order: 1 }}>
                <div ref={cardRef}>
                  <ListTitle>Pictures</ListTitle>
                  {loadingState.pics
                    ? LoadingImageCards
                    : pics
                        .filter((x) => x.url.length)
                        .map((item) => <ImageCard key={item.id} post={item} maxWidth={cardWidth} />)}
                </div>
              </Col>

              <Col lg={8} span={12} order={3} xs={{ order: 2 }}>
                <ListTitle>Memes</ListTitle>
                {loadingState.memes
                  ? LoadingImageCards
                  : memes
                      .filter((x) => x.url.length)
                      .map((item) => <ImageCard key={item.id} post={item} maxWidth={cardWidth} />)}
              </Col>
            </Row>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentView;
