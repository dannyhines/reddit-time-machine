import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { ArchiveMonth, getArchiveMonths } from "../../utils/archive";
import styles from "../../styles/Archive.module.css";

interface ArchiveIndexProps {
  months: ArchiveMonth[];
}

const url = "https://www.reddit-time-machine.com/archive";

const ArchiveIndex: NextPage<ArchiveIndexProps> = ({ months }) => {
  const monthsByYear = months.reduce<Record<string, ArchiveMonth[]>>((years, month) => {
    years[month.year] = [...(years[month.year] ?? []), month];
    return years;
  }, {});

  return (
    <div>
      <Head>
        <title>Browse the Reddit Archive by Date | Reddit Time Machine</title>
        <meta
          name='description'
          content="Browse Reddit's archived front page by year, month, and day from 2009 through 2022."
        />
        <link rel='canonical' href={url} />
      </Head>
      <Header />
      <main className={styles.archive_page}>
        <h1>Browse the Reddit archive by date</h1>
        <p>Explore what appeared on Reddit’s front page on every day from 2009 through 2022.</p>
        {Object.entries(monthsByYear)
          .reverse()
          .map(([year, yearMonths]) => (
            <section className={styles.year_group} key={year}>
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
