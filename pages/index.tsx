import type { NextPage } from "next";
import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";
import getRandomDate from "../components/DateSelector/getRandomDate";
import DateSelectionView from "../components/DateSelector";
import router from "next/router";
import dayjs from "dayjs";
import styles from "../styles/Home.module.css";
import { useCallback, useState } from "react";
import { Divider, Spin } from "antd";
import { getShortDateString } from "../utils/date-util";
import FeaturedDates from "../components/FeaturedDates";
import BestMemes from "../components/BestMemes";

const title = "Reddit Time Machine - Explore a day in internet history";
const description = `Explore Reddit history with Reddit Time Machine. See the most up-voted news, pictures, and memes on any day in the Reddit archive.`;
const url = "https://www.reddit-time-machine.com";

const Home: NextPage = () => {
  const [loading, setloading] = useState(false);
  const [dateStr, setdateStr] = useState<string>();

  const handleDateSelection = useCallback((dateStr: string) => {
    setloading(true);
    setdateStr(dateStr);
    const newDate = dayjs(dateStr).format("YYYY-MM-DD");
    router.push(`/${newDate}`);
  }, []);

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name='title' content={title} />
        <meta name='description' content={description} />
        <meta
          name='keywords'
          content='Reddit Archive,Reddit Time Machine,Reddit,news,politics,memes,history,predictions,internet history'
        />
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='theme-color' content='#050505' />
        <meta name='google-site-verification' content='gjIhXeExnAXrpzOM0Ck7qpYWPV6S7JuEC-gQ8RuHAOI' />

        <meta property='og:type' content='website' />
        <meta property='og:url' content={url} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='og:image' content='https://random-public-images-dch.s3.amazonaws.com/rtm-screenshot.png' />
        <meta property='og:author' content='Danny Hines' />

        <meta name='twitter:card' content='summary' />
        <meta name='twitter:url' content={url} />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content='https://random-public-images-dch.s3.amazonaws.com/rtm-screenshot.png' />
      </Head>

      <Header />

      <main className={styles.main}>
        <div className={styles.content_view}>
          <DateSelectionView
            showingDate={getRandomDate().format("YYYY-MM-DD")}
            handleSubmit={handleDateSelection}
            onHomePage
          />
          {!loading && <FeaturedDates handleDateSelection={handleDateSelection} />}

          {loading && (
            <div style={{ textAlign: "center", paddingTop: 16, minHeight: 500 }}>
              <Divider style={{ borderTopColor: "#636363" }}>
                <h2>{getShortDateString(dayjs(dateStr))}</h2>
              </Divider>
              <Spin spinning={loading} size='large' />
            </div>
          )}

          <BestMemes loading={loading} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
