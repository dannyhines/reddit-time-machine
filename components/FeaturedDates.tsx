import { Image } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import ListTitle from "./ListTitle";
import styles from "../styles/FeaturedDates.module.css";
import { FEATURED_DATES_POSTS } from "../utils/featuredDatesPosts";

const FeaturedDates = () => {
  return (
    <section className={styles.featured_section}>
      <div className={styles.section_heading}>
        <ListTitle>Featured dates</ListTitle>
        <p>Jump to memorable moments in Reddit history.</p>
      </div>
      <div className={styles.card_container}>
        {FEATURED_DATES_POSTS.map(({ date, description, img }) => (
          <Link
            className={styles.featured_date_link}
            key={date}
            href={`/${date}`}
            aria-label={`Explore Reddit on ${dayjs(date).format("MMMM D, YYYY")}: ${description}`}
          >
            <article className={styles.featured_date_card}>
              <Image
                src={img}
                alt={description}
                className={styles.card_image}
                preview={false}
                width='100%'
              />
              <div className={styles.card_overlay}>
                <span>Featured date</span>
                <h3>{description}</h3>
                <time dateTime={date}>{dayjs(date).format("MMM D, YYYY")}</time>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedDates;
