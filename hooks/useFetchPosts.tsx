import { useState, useEffect } from "react";
import { Post } from "../types/Post";
import dayjs from "dayjs";

interface UseFetchPostsResult {
  loading: boolean;
  error: any;
  memes: Post[];
  politics: Post[];
  news: Post[];
  pics: Post[];
  sports: Post[];
}

export const useFetchPosts = (date: string): UseFetchPostsResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [memes, setMemes] = useState<Post[]>([]);
  const [politics, setPolitics] = useState<Post[]>([]);
  const [news, setNews] = useState<Post[]>([]);
  const [pics, setPics] = useState<Post[]>([]);
  const [sports, setSports] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/posts?date=${date}`);
        const data: Post[] = await response.json();
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
  }, [date]);

  return { loading, error, memes, politics, news, pics, sports };
};
