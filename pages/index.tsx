import type { NextPage } from "next";
import Head from "next/head";
import ContentView from "../components/ContentView";
import Footer from "../components/Footer";
import Header from "../components/Header";
import getRandomDate from "../components/DateSelector/getRandomDate";
import DateSelectionView from "../components/DateSelector";
import router from "next/router";
import dayjs from "dayjs";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const title = "Reddit Time Machine";
  const description = "View the most popular news, pictures and memes from a day in Reddit history.";
  const url = "https://www.reddit-time-machine.com";

  const handleDateSelection = (dateStr: string) => {
    const newDate = dayjs(dateStr).format("YYYY-MM-DD");
    router.push(`/${newDate}`, undefined, { shallow: true });
  };

  return (
    <div>
      <Head>
        <title>Reddit Time Machine</title>
        <meta name='title' content={title} />
        <meta name='description' content={description} />
        <meta name='keywords' content='Reddit,news,politics,memes,history,internet' />
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
        <DateSelectionView
          showingDate={getRandomDate().format("YYYY-MM-DD")}
          handleSubmit={handleDateSelection}
          onHomePage
        />
      </main>

      <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
