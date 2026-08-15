import Head from "next/head";
import Header from "../components/Header";
import ContentView from "../components/ContentView";
import DateArchiveIntro from "../components/DateArchiveIntro";
import Footer from "../components/Footer";
import { isDateInRange, isValidDate } from "../utils/date-util";
import { GetStaticProps, GetStaticPaths } from "next";
import { Post } from "../types/Post";
import { FEATURED_DATES_POSTS } from "../utils/featuredDatesPosts";
import { getArchiveDates } from "../utils/archive";
import { getDateMetaDescription, getReadableDate } from "../utils/seo";
import { getPostsForDate } from "../server/database";

interface Props {
  date: string;
  posts: Post[];
}

const DatePage = (props: Props) => {
  const readableDate = getReadableDate(props.date);
  const title = `Reddit on ${readableDate}: Top Posts and Discussions`;
  const description = getDateMetaDescription(props.date, props.posts);
  const url = `https://www.reddit-time-machine.com/${props.date}`;
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name='title' content={title} />
        <meta name='description' content={description} />
        <link rel='canonical' href={url} />
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
      <DateArchiveIntro date={props.date} posts={props.posts} />
      <ContentView initialDate={props.date} posts={props.posts} />
      <Footer />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allDates = getArchiveDates();
  const devDates = FEATURED_DATES_POSTS.flatMap((x) => x.date);

  const datesToGenerate = process.env.NODE_ENV === "production" ? allDates : devDates;
  const paths = datesToGenerate.map((date) => ({ params: { date } }));

  console.log("[getStaticPaths] Generating " + paths.length + " paths");
  return { paths, fallback: process.env.NODE_ENV === "production" ? false : "blocking" };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const date = typeof context.params?.date === "string" ? context.params?.date : "";
  if (!isValidDate(date) || !isDateInRange(date)) {
    return { notFound: true };
  }

  const posts = await getPostsForDate(date);
  if (!posts.length) {
    return { notFound: true };
  }

  return { props: { date, posts } };
};

export default DatePage;
