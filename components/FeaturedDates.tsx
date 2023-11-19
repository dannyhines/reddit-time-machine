import { Card, Image } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import ListTitle from "./ListTitle";
import styles from "../styles/FeaturedDates.module.css";

interface Props {
  handleDateSelection: (date: string) => void;
}

const FeaturedDates = ({ handleDateSelection }: Props) => {
  const dates = [
    {
      date: "2021-04-24",
      description: "The Battle of Josh",
      img: "https://i.redd.it/4h3qdfnyn5v61.jpg",
    },
    {
      date: "2019-09-20",
      description: "Area 51 Raid",
      img: "https://preview.redd.it/jgh2angxnrn31.jpg?width=640&crop=smart&auto=webp&s=1cd90b9463febaee8a749c6a06f2ece78479426e",
    },
    {
      date: "2016-11-08",
      description: "Trump beats Hillary 2016",
      img: "https://res.cloudinary.com/dannyhines/image/upload/v1698107978/Reddit%20Time%20Machine/bernie-meme.png",
    },
    {
      date: "2020-03-15",
      description: "COVID-19 lockdowns begin",
      img: "https://preview.redd.it/ltv53wz6lxm41.jpg?width=640&crop=smart&auto=webp&s=203dfc7b3c8d55c52be9a26f7d994063435e5453",
    },
    {
      date: "2017-02-05",
      description: "Patriots win Super Bowl LI",
      img: "https://i.imgur.com/uiaiNcv.jpg",
    },
    {
      date: "2015-12-25",
      description: "Christmas 2016",
      img: "https://i.redditmedia.com/hfPa8RYje0OkmgD_o1BSCjHMdZtqc8Bes7K6WjmZ59Q.jpg?s=2e896adec813a352ebe4c805cb781200",
    },
    {
      date: "2014-11-09",
      description: "Random day in 2014",
      img: "https://i.imgur.com/mB6Atxp.jpg",
    },
    {
      date: "2020-11-29",
      description: "My 25th birthday",
      img: "https://preview.redd.it/o1cqujo8p8261.png?auto=webp&s=94aa2f91200c48c9296691ec3ad89b05e5bd70b3",
    },
    { date: "2011-05-02", description: "Bin Laden Killed", img: "https://i.imgur.com/tjRP1.jpg" },
    {
      date: "2020-11-07",
      description: "Biden beats Trump 2020",
      img: "https://preview.redd.it/3xftffpqiux51.jpg?width=640&crop=smart&auto=webp&s=d7e1ed2205ba8560e442a32de1882e18c83fcdec ",
    },
    {
      date: "2015-02-14",
      description: "Valentine's Day 2015",
      img: "https://i.imgur.com/ZCaKlwX.png",
    },
    {
      date: "2021-01-06",
      description: "Jan 6 Capital Riot",
      img: "https://preview.redd.it/zqcckk5gls961.png?width=320&crop=smart&auto=webp&s=e5e4957ea47cf9e6f0dc1af966c24c407c6667c0 ",
    },
  ];

  return (
    <div style={{ paddingTop: 20 }}>
      <ListTitle>Featured Posts</ListTitle>
      <div className={styles.card_container}>
        {dates.map(({ date, description, img }) => (
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
