import { useRef, useState, useEffect } from "react";

export const useCardWidth = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setcardWidth] = useState(400);

  useEffect(() => {
    function handleResize() {
      if (cardRef.current) {
        setcardWidth(cardRef.current.offsetWidth);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { cardRef, cardWidth };
};
