import dayjs from "dayjs";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import { getArchiveMonths, getDatesForArchiveMonth } from "../../../utils/archive";
import { getReadableDate } from "../../../utils/seo";
import styles from "../../../styles/Archive.module.css";

interface MonthArchiveProps {
  year: string;
  month: string;
  dates: string[];
}

const MonthArchive: NextPage<MonthArchiveProps> = ({ year, month, dates }) => {
  const label = dayjs(`${year}-${month}-01`).format("MMMM YYYY");
  const url = `https://www.reddit-time-machine.com/archive/${year}/${month}`;

  return (
    <div>
      <Head>
        <title>Reddit in {label}: Daily Front Page Archive</title>
        <meta name='description' content={`Browse Reddit's front page archive for every day in ${label}.`} />
        <link rel='canonical' href={url} />
      </Head>
      <Header />
      <main className={styles.archive_page}>
        <h1>Reddit in {label}</h1>
        <p>Select a day to see the top Reddit posts and discussions from that date.</p>
        <ul className={styles.day_grid}>
          {dates.map((date) => (
            <li key={date}>
              <Link href={`/${date}`}>{getReadableDate(date)}</Link>
            </li>
          ))}
        </ul>
        <Link className={styles.archive_back} href='/archive'>
          ← Browse all years
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getArchiveMonths().map(({ year, month }) => ({ params: { year, month } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<MonthArchiveProps> = async ({ params }) => {
  const year = typeof params?.year === "string" ? params.year : "";
  const month = typeof params?.month === "string" ? params.month : "";
  const dates = getDatesForArchiveMonth(year, month);

  if (!dates.length) return { notFound: true };
  return { props: { year, month, dates } };
};

export default MonthArchive;
