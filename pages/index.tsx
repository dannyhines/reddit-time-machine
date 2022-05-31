import type { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import ContentView from '../components/ContentView';
import Footer from '../components/Footer';
import Header from '../components/Header';
// import { getShortDateString } from '../utils/getDates';

interface Props {
  initialDate: number;
}

const Home: NextPage = (props: any) => {
  const description = 'View the most popular news, pictures and memes from a day in Reddit history.';
  // TODO: Change title to display date using getShortDateString()
  return (
    <div>
      <Head>
        <title>Reddit Time Machine</title>
        <meta name='title' content='Reddit Time Machine' />
        <meta name='description' content={description} />
        <meta name='keywords' content='Reddit,news,politics,memes,history,internet' />
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='theme-color' content='#050505' />
        <meta name='google-site-verification' content='gjIhXeExnAXrpzOM0Ck7qpYWPV6S7JuEC-gQ8RuHAOI' />

        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://www.reddit-time-machine.com' />
        <meta property='og:title' content='Reddit Time Machine' />
        <meta property='og:description' content={description} />
        <meta property='og:image' content='https://random-public-images-dch.s3.amazonaws.com/rtm-screenshot.png' />
        <meta property='og:author' content='Danny Hines' />

        <meta name='twitter:card' content='summary' />
        <meta name='twitter:url' content='https://www.reddit-time-machine.com' />
        <meta name='twitter:title' content='Reddit Time Machine' />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content='https://random-public-images-dch.s3.amazonaws.com/rtm-screenshot.png' />
      </Head>

      <Header />
      <ContentView initialDate={props.initialDate} />
      <Footer />
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const _date = parseInt(typeof context.query.d === 'string' ? context.query.d : '0');
  const initialDate = _date > 1407161600 ? _date : 0;
  return {
    props: { initialDate },
  };
}

export default Home;
