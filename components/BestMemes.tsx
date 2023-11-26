import React from "react";
import { BEST_MEMES } from "../utils/best-memes";
import Masonry from "react-masonry-css";
import ImageCard from "./ImageCard";
import ListTitle from "./ListTitle";
import useWindowDimensions from "../hooks/useWindowDimensions";
const SORTED_MEMES = BEST_MEMES.sort((a, b) => b.created_utc - a.created_utc);
interface Props {
  loading: boolean;
}

const BestMemes: React.FC<Props> = (props: Props) => {
  const { loading } = props;
  const { isMobile } = useWindowDimensions();

  if (loading) return null;

  return (
    <div>
      <ListTitle>Top memes of all time</ListTitle>

      <Masonry
        breakpointCols={isMobile ? 2 : 3}
        className='my-masonry-grid'
        columnClassName='my-masonry-grid_column'
        style={{ textAlign: "center" }}
      >
        {SORTED_MEMES.filter((x) => x && x.url.length).map((item) => (
          <ImageCard key={item.id} post={item} maxWidth={400} loading={loading} showDate />
        ))}
      </Masonry>
    </div>
  );
};

export default BestMemes;
