import { useState, useEffect } from "react";
import { Post } from "../types/Post";

interface UseFetchPostsResult {
  loading: boolean;
  error: any;
  politics: Post[];
  news: Post[];
  picsAndMemes: Post[];
  sports: Post[];
  allPosts: Post[];
}

export const useFetchPosts = (date: string, posts?: Post[]): UseFetchPostsResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [politics, setPolitics] = useState<Post[]>([]);
  const [news, setNews] = useState<Post[]>([]);
  const [sports, setSports] = useState<Post[]>([]);
  const [picsAndMemes, setPicsAndMemes] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Statically-generated pages should have the posts passed as a param, otherwise call the API
        // (in production the posts array should always exist, in dev we only statically generate a few pages)
        let data: Post[];
        if (!!posts && posts.length > 0 && date === posts[0].created_date.split("T")[0]) {
          data = posts;
        } else {
          const response = await fetch(`/api/posts?date=${date}`);
          data = await response.json();
        }
        setAllPosts(data);
        setPolitics(data.filter((x) => x.post_type === "politics").slice(0, 5));
        setNews(data.filter((x) => x.post_type === "news").slice(0, 8));
        setSports(data.filter((x) => x.post_type === "sports").slice(0, 5));

        const memes = data.filter((x) => x.post_type === "meme").slice(0, 10);
        const pics = data.filter((x) => x.post_type === "pics").slice(0, 8);
        setPicsAndMemes([...pics, ...memes].sort((a, b) => b.score - a.score));
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, posts]);

  return { loading, error, picsAndMemes, politics, news, sports, allPosts };
};
