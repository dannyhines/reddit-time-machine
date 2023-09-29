import { useState, useEffect } from "react";
import { Post } from "../types/Post";
import dayjs, { Dayjs } from "dayjs";

interface UseFetchPredictionsResult {
  predictions: Post[];
}

export const useFetchPredictions = (date: string): UseFetchPredictionsResult => {
  // const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<Post[]>([]);
  const is2YearsOld = (d: Dayjs) => d.add(2, "year").isBefore(dayjs());

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        const d = dayjs(date);
        if (is2YearsOld(d)) {
          const from = d.startOf("month").format("YYYY-MM-DD");
          const to = d.add(1, "month").startOf("month").format("YYYY-MM-DD");
          const predictionsResponse = await fetch(`/api/predictions?from=${from}&to=${to}`);
          const predictionPosts = await predictionsResponse.json();
          setPredictions(predictionPosts.slice(0, 6));
        }
      } catch (error: any) {
        console.log("Error fetching predictions:", error);
      }
    };

    fetchData();
  }, [date]);

  return { predictions };
};
