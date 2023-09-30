import { useState, useEffect } from "react";

export const useImage = (src?: string, srcset?: string) => {
  const [imgHasLoaded, setHasLoaded] = useState(false);
  const [imgHasError, setHasError] = useState(false);
  const [hasStartedInitialFetch, setHasStartedInitialFetch] = useState(false);

  useEffect(() => {
    setHasStartedInitialFetch(true);
    setHasLoaded(false);
    setHasError(false);

    // Here's where the magic happens.
    const image = new Image();
    if (srcset) {
      image.srcset = srcset;
    } else {
      image.src = src ?? "";
    }

    const handleError = () => {
      setHasError(true);
    };

    const handleLoad = () => {
      setHasLoaded(true);
      setHasError(false);
    };

    image.onerror = handleError;
    image.onload = handleLoad;

    return () => {
      image.removeEventListener("error", handleError);
      image.removeEventListener("load", handleLoad);
    };
  }, [src, srcset]);

  if (!src) return { hasLoaded: false, hasError: false, hasStartedInitialFetch: false };
  return { imgHasLoaded, imgHasError, hasStartedInitialFetch };
};
