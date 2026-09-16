import dayjs from "dayjs";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import { getAdjacentArchiveMonths, getArchiveMonths, getDatesForArchiveMonth } from "../../../utils/archive";
import {
  SITE_NAME,
  SOCIAL_IMAGE_HEIGHT,
  SOCIAL_IMAGE_WIDTH,
  getReadableDate,
  getSocialImageUrl,
} from "../../../utils/seo";
import styles from "../../../styles/Archive.module.css";

interface MonthArchiveProps {
  year: string;
  month: string;
  dates: string[];
}

const MonthArchive: NextPage<MonthArchiveProps> = ({ year, month, dates }) => {
  const label = dayjs(`${year}-${month}-01`).format("MMMM YYYY");
  const url = `https://www.reddit-time-machine.com/archive/${year}/${month}`;
  const title = `Reddit in ${label}: Daily Front Page Archive`;
  const description = `Browse Reddit's front page archive for every day in ${label}.`;
  const socialImageUrl = getSocialImageUrl({ kind: "month", year, month });
  const { previous, next } = getAdjacentArchiveMonths(year, month);

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <link rel='canonical' href={url} />
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content={SITE_NAME} />
        <meta property='og:url' content={url} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='og:image' content={socialImageUrl} />
        <meta property='og:image:width' content={String(SOCIAL_IMAGE_WIDTH)} />
        <meta property='og:image:height' content={String(SOCIAL_IMAGE_HEIGHT)} />
        <meta property='og:image:alt' content={`Reddit archive for ${label}`} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content={socialImageUrl} />
      </Head>
      <Header />
      <main className={styles.archive_page}>
        <nav className={styles.breadcrumbs} aria-label='Breadcrumb'>
          <Link href='/archive'>Archive</Link>
          <span aria-hidden='true'>/</span>
          <span>{year}</span>
          <span aria-hidden='true'>/</span>
          <span aria-current='page'>{dayjs(`${year}-${month}-01`).format("MMMM")}</span>
        </nav>
        <h1>Reddit in {label}</h1>
        <p>Select a day to see the top Reddit posts and discussions from that date.</p>
        <nav className={styles.month_navigation} aria-label='Browse archive months'>
          {previous ? (
            <Link href={`/archive/${previous.year}/${previous.month}`}>
              <span aria-hidden='true'>←</span> {previous.label}
            </Link>
          ) : (
            <span />
          )}
          <Link href='/archive'>All years</Link>
          {next ? (
            <Link href={`/archive/${next.year}/${next.month}`}>
              {next.label} <span aria-hidden='true'>→</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
        <ul className={styles.day_grid}>
          {dates.map((date, index) => (
            <li key={date} style={index === 0 ? { gridColumnStart: dayjs(date).day() + 1 } : undefined}>
              <Link href={`/${date}`} aria-label={getReadableDate(date)}>
                <span>{dayjs(date).format("ddd")}</span>
                <strong>{dayjs(date).format("D")}</strong>
              </Link>
            </li>
          ))}
        </ul>
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
