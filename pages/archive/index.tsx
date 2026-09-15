import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { ArchiveMonth, getArchiveMonths } from "../../utils/archive";
import { SITE_NAME, SOCIAL_IMAGE_URL } from "../../utils/seo";
import styles from "../../styles/Archive.module.css";

interface ArchiveIndexProps {
  months: ArchiveMonth[];
}

const url = "https://www.reddit-time-machine.com/archive";
const title = "Browse the Reddit Archive by Date | Reddit Time Machine";
const description = "Browse Reddit's archived front page by year, month, and day from 2009 through 2022.";

const ArchiveIndex: NextPage<ArchiveIndexProps> = ({ months }) => {
  const monthsByYear = months.reduce<Record<string, ArchiveMonth[]>>((years, month) => {
    years[month.year] = [...(years[month.year] ?? []), month];
    return years;
  }, {});
  const yearEntries = Object.entries(monthsByYear).reverse();

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
        <meta property='og:image' content={SOCIAL_IMAGE_URL} />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='628' />
        <meta property='og:image:alt' content='Reddit Time Machine home page' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content={SOCIAL_IMAGE_URL} />
      </Head>
      <Header />
      <main className={styles.archive_page}>
        <h1>Browse the Reddit archive by date</h1>
        <p>Explore what appeared on Reddit’s front page on every day from 2009 through 2022.</p>
        <nav className={styles.year_navigation} aria-label='Jump to a year'>
          <span>Jump to</span>
          <div>
            {yearEntries.map(([year]) => (
              <a key={year} href={`#year-${year}`}>
                {year}
              </a>
            ))}
          </div>
        </nav>
        {yearEntries.map(([year, yearMonths]) => (
          <section className={styles.year_group} id={`year-${year}`} key={year}>
            <h2>Reddit in {year}</h2>
            <ul className={styles.month_grid}>
              {yearMonths.map((month) => (
                <li key={`${month.year}-${month.month}`}>
                  <Link href={`/archive/${month.year}/${month.month}`}>{month.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export const getStaticProps: GetStaticProps<ArchiveIndexProps> = async () => ({
  props: { months: getArchiveMonths() },
});

export default ArchiveIndex;
