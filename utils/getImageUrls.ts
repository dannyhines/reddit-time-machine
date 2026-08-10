import { Post, Resolution } from "../types/Post";

export interface ImageCandidate {
  src: string;
  srcSet?: string;
  previewUrl?: string;
  aspectRatio?: number;
}

const getAspectRatio = (width?: number | null, height?: number | null) => {
  return width && height ? width / height : undefined;
};

/** Reddit's API commonly stores query strings with HTML-escaped ampersands. */
export const normalizeRedditImageUrl = (url?: string | null) => {
  if (!url) return undefined;

  return url
    .replace(/&amp;|&#0*38;|&#x0*26;/gi, "&")
    .replace(/^http:\/\//i, "https://");
};

const getSrcSet = (resolutions?: Resolution[]) => {
  const entries = (resolutions ?? [])
    .map((resolution) => {
      const url = normalizeRedditImageUrl(resolution.url);
      return url ? `${url} ${resolution.width}w` : undefined;
    })
    .filter((entry): entry is string => Boolean(entry));

  return entries.length ? entries.join(", ") : undefined;
};

/**
 * Builds an ordered fallback chain. Preview media is preferred because article
 * URLs are often HTML pages rather than images; the original URL and thumbnail
 * remain useful fallbacks for older records that do not contain preview data.
 */
export function getImageCandidates(post?: Post): ImageCandidate[] {
  if (!post) return [];

  const candidates: ImageCandidate[] = [];
  const previewImage = post.preview?.images?.[0];
  const gifPreview = previewImage?.variants?.gif;

  const addCandidate = (
    src?: string | null,
    resolutions?: Resolution[],
    width?: number | null,
    height?: number | null,
    previewUrl?: string | null
  ) => {
    const normalizedSrc = normalizeRedditImageUrl(src);
    if (!normalizedSrc) return;

    candidates.push({
      src: normalizedSrc,
      srcSet: getSrcSet(resolutions),
      previewUrl: normalizeRedditImageUrl(previewUrl) ?? normalizedSrc,
      aspectRatio: getAspectRatio(width, height),
    });
  };

  addCandidate(
    gifPreview?.source?.url,
    gifPreview?.resolutions,
    gifPreview?.source?.width,
    gifPreview?.source?.height,
    gifPreview?.source?.url
  );
  addCandidate(
    previewImage?.source?.url,
    previewImage?.resolutions,
    previewImage?.source?.width,
    previewImage?.source?.height,
    previewImage?.source?.url
  );
  addCandidate(post.url, undefined, post.thumbnail_width, post.thumbnail_height, previewImage?.source?.url);

  if (post.thumbnail !== "default" && post.thumbnail !== "self" && post.thumbnail !== "nsfw") {
    addCandidate(post.thumbnail, undefined, post.thumbnail_width, post.thumbnail_height);
  }

  // The same URL can occur in several Reddit fields. Trying it repeatedly only
  // delays the text-only fallback and causes duplicate network requests.
  return candidates.filter(
    (candidate, index) => candidates.findIndex((other) => other.src === candidate.src) === index
  );
}
