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

const groupPosts = (posts: Post[]) => {
  const memes = posts.filter((post) => post.post_type === "meme").slice(0, 10);
  const pics = posts.filter((post) => post.post_type === "pics").slice(0, 8);

  return {
    politics: posts.filter((post) => post.post_type === "politics").slice(0, 5),
    news: posts.filter((post) => post.post_type === "news").slice(0, 8),
    sports: posts.filter((post) => post.post_type === "sports").slice(0, 5),
    picsAndMemes: [...pics, ...memes].sort((a, b) => b.score - a.score),
  };
};

export const useFetchPosts = (date: string, posts?: Post[]): UseFetchPostsResult => {
  const initialPosts = posts ?? [];
  const initialGroups = groupPosts(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allPosts, setAllPosts] = useState<Post[]>(initialPosts);
  const [politics, setPolitics] = useState<Post[]>(initialGroups.politics);
  const [news, setNews] = useState<Post[]>(initialGroups.news);
  const [sports, setSports] = useState<Post[]>(initialGroups.sports);
  const [picsAndMemes, setPicsAndMemes] = useState<Post[]>(initialGroups.picsAndMemes);

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
        const groups = groupPosts(data);
        setAllPosts(data);
        setPolitics(groups.politics);
        setNews(groups.news);
        setSports(groups.sports);
        setPicsAndMemes(groups.picsAndMemes);
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
