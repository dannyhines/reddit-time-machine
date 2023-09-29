import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import getRandomDate from "../components/DateSelector/getRandomDate";

export const useDateSelection = (initialDate?: string) => {
  const router = useRouter();
  const [date, setDate] = useState<string>(initialDate ?? getRandomDate().format("YYYY-MM-DD"));

  const handleDateChanged = useCallback(
    (x: string) => {
      router.push(`/${x}`, undefined, { shallow: true });
      setDate(x);
    },
    [router]
  );

  return { date, handleDateChanged };
};
