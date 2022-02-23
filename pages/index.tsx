import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import ContentView from "../components/ContentView";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Reddit Time Machine</title>
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="View the most popular news, discussions and memes from Reddit on a day in the past."
        />
        <meta
          name="keywords"
          content="Reddit,news,politics,memes,history,internet"
        />
        <meta name="author" content="Danny Hines" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="twitter:card" content="app" />
        <meta
          name="twitter:description"
          content="View the most popular news, discussions and memes from Reddit on a day in the past."
        />
        <meta name="twitter:title" content="Reddit Time Machine" />
        <meta
          name="twitter:image"
          content="https://random-public-images-dch.s3.amazonaws.com/rtm-logo.png"
        />
        <meta name="twitter:creator" content="@danny__hines" />
      </Head>

      <Header />
      <ContentView />
      <Footer />
    </div>
  );
};

export default Home;
