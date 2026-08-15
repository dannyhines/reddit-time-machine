import { useState, useEffect } from "react";

const SERVER_DIMENSIONS = { width: 1024, height: 1000 };

function getWindowDimensions() {
  if (typeof window !== "undefined") {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  } else {
    return SERVER_DIMENSIONS;
  }
}

export default function useWindowDimensions() {
  // Use the same first render on the server and client. Reading window during
  // the state initializer produces different markup and hydration failures.
  const [windowDimensions, setWindowDimensions] = useState(SERVER_DIMENSIONS);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { ...windowDimensions, isDesktop: windowDimensions.width >= 1024, isMobile: windowDimensions.width < 500 };
}
