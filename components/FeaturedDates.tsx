import { Card, Image } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import ListTitle from "./ListTitle";
import styles from "../styles/FeaturedDates.module.css";
import { FEATURED_DATES_POSTS } from "../utils/featuredDatesPosts";

interface Props {
  handleDateSelection: (date: string) => void;
}

const FeaturedDates = ({ handleDateSelection }: Props) => {
  return (
    <div style={{ paddingTop: 20 }}>
      <ListTitle>Featured Posts</ListTitle>
      <div className={styles.card_container}>
        {FEATURED_DATES_POSTS.map(({ date, description, img }) => (
          <Link key={date} href={`/${date}`}>
            <Card className={styles.featured_post_card} onClick={() => handleDateSelection(date)}>
              <Image
                src={img}
                alt={description}
                className={styles.card_image}
                preview={false}
                height={150}
                width={"100%"}
              />
              <div className={styles.card_body}>
                <h3>{description}</h3>
                <p style={{ opacity: 0.7 }}>{dayjs(date).format("MMMM D, YYYY")}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedDates;
