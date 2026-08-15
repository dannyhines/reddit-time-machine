import dayjs from "dayjs";
import Link from "next/link";
import { Post } from "../types/Post";
import { getAdjacentArchiveDates } from "../utils/archive";
import { getDateSummary, getReadableDate } from "../utils/seo";
import styles from "../styles/Archive.module.css";

interface DateArchiveIntroProps {
  date: string;
  posts: Post[];
}

const DateArchiveIntro = ({ date, posts }: DateArchiveIntroProps) => {
  const { previous, next } = getAdjacentArchiveDates(date);
  const monthArchiveUrl = `/archive/${dayjs(date).format("YYYY/MM")}`;

  return (
    <section className={styles.date_intro}>
      <h1>Reddit on {getReadableDate(date)}</h1>
      <p>{getDateSummary(date, posts)}</p>
      <nav className={styles.date_navigation} aria-label='Browse the Reddit archive by date'>
        {previous ? <Link href={`/${previous}`}>← {getReadableDate(previous)}</Link> : <span />}
        <Link href={monthArchiveUrl}>Browse {dayjs(date).format("MMMM YYYY")}</Link>
        {next ? <Link href={`/${next}`}>{getReadableDate(next)} →</Link> : <span />}
      </nav>
    </section>
  );
};

export default DateArchiveIntro;
