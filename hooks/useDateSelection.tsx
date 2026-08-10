import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { LAST_AVAILABLE_DATE } from "../utils/constants";

export const useDateSelection = (initialDate?: string) => {
  const router = useRouter();
  const [date, setDate] = useState<string>(initialDate ?? LAST_AVAILABLE_DATE.format("YYYY-MM-DD"));

  const handleDateChanged = useCallback(
    (x: string) => {
      router.push(`/${x}`); // triggers a page refresh
      setDate(x);
    },
    [router]
  );

  return { date, handleDateChanged };
};
