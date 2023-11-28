import { useState, useEffect } from "react";
import { Post } from "../types/Post";

interface UseFetchPostsResult {
  loading: boolean;
  error: any;
  memes: Post[];
  politics: Post[];
  news: Post[];
  pics: Post[];
  sports: Post[];
  allPosts: Post[];
}

export const useFetchPosts = (date: string, posts?: Post[]): UseFetchPostsResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [memes, setMemes] = useState<Post[]>([]);
  const [politics, setPolitics] = useState<Post[]>([]);
  const [news, setNews] = useState<Post[]>([]);
  const [pics, setPics] = useState<Post[]>([]);
  const [sports, setSports] = useState<Post[]>([]);

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
        setMemes(data.filter((x) => x.post_type === "meme").slice(0, 8));
        setPolitics(data.filter((x) => x.post_type === "politics").slice(0, 5));
        setNews(data.filter((x) => x.post_type === "news").slice(0, 8));
        setPics(data.filter((x) => x.post_type === "pics").slice(0, 6));
        setSports(data.filter((x) => x.post_type === "sports").slice(0, 5));
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, posts]);

  return { loading, error, memes, politics, news, pics, sports, allPosts };
};

// export const filterPosts = (posts: Post[]) => {
//   const memes = posts.filter((x) => x.post_type === "meme").slice(0, 8);
//   const politics = posts.filter((x) => x.post_type === "politics").slice(0, 5);
//   const news = posts.filter((x) => x.post_type === "news").slice(0, 8);
//   const pics = posts.filter((x) => x.post_type === "pics").slice(0, 6);
//   const sports = posts.filter((x) => x.post_type === "sports").slice(0, 5);
//   return { memes, politics, news, pics, sports, allPosts: posts };
// };
