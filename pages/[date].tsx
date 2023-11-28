import Head from "next/head";
import Header from "../components/Header";
import ContentView from "../components/ContentView";
import Footer from "../components/Footer";
import getRandomDate from "../components/DateSelector/getRandomDate";
import { GetServerSidePropsContext } from "next";
import { getMonthDayYear, getShortDateString, isDateInRange, isValidDate } from "../utils/date-util";
import dayjs from "dayjs";
import { GetStaticProps, GetStaticPaths } from "next";
import { generateDateStrings } from "../utils/generateDateStrings";
import { Post } from "../types/Post";
import { FEATURED_DATES_POSTS } from "../utils/featuredDatesPosts";

interface Props {
  date: string;
  posts: Post[];
}

const DatePage = (props: Props) => {
  const date = dayjs(props.date);
  const title = `Reddit Time Machine | ${getShortDateString(date)}`;
  const description = `View the most popular news, pictures and memes from ${getMonthDayYear(date)}.`;
  const url = `https://www.reddit-time-machine.com/${props.date}`;
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
      <ContentView initialDate={props.date} posts={props.posts} />
      <Footer />
    </div>
  );
};

// Either passes the date as a prop if it's valid, or redirects to a random date's page
// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const date = context.params?.date ?? "";
//   if (!isDateInRange(date)) {
//     return {
//       redirect: {
//         destination: `/${getRandomDate().format("YYYY-MM-DD")}`,
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: { date: date },
//   };
// }

export const getStaticPaths: GetStaticPaths = async () => {
  const allDates = generateDateStrings("2009-01-01", "2022-12-27");
  const devDates = FEATURED_DATES_POSTS.flatMap((x) => x.date);

  const datesToGenerate = process.env.NODE_ENV === "production" ? allDates : devDates;
  const paths = datesToGenerate.map((date) => ({ params: { date } }));

  console.log("Generating " + paths.length + " paths");
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const date = context.params?.date ?? "";
  const response = await fetch(`https://www.reddit-time-machine.com/api/posts?date=${date}`);
  const posts: Post[] = await response.json();
  return {
    props: { date: date, posts },
  };
};

export default DatePage;
