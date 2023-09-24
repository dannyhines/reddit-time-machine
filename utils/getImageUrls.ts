import { Post } from "../types/Post";

const getAspectRatio = (width: number | null, height: number | null) => {
  return width && height ? width / height : undefined;
};

/*
 *
 * returns the image urls, calculates w/h (aspect ratio)
 * older posts don't contain a 'preview' field, thumbnail width & height
 * // TODO: use is_video, is_reddit_media_domain, preview.variants?
 */
export function getImageUrls(post?: Post) {
  if (!post || !post.url) return { src: "" };
  let { url, thumbnail, preview, thumbnail_width, thumbnail_height } = post;
  let aspectRatio = getAspectRatio(thumbnail_width, thumbnail_height);

  thumbnail = thumbnail && thumbnail !== "default" ? thumbnail.replace("http://", "https://") : null; // most are 'default'
  let imgUrl = url.replace("http://", "https://") ?? "";
  let smallestPreviewUrl = null; // tried to set to thumbnail, but it's too small

  if (preview) {
    // If there's a 'preview' field, use that
    const imgObject = preview.images[0];
    const { source, resolutions } = imgObject;
    imgUrl = source ? source.url : imgUrl;
    aspectRatio = getAspectRatio(source.width, source.height) ?? aspectRatio;
    smallestPreviewUrl = resolutions && resolutions.length ? resolutions[0].url : null;
  }

  return {
    imgUrl,
    thumbnailUrl: thumbnail ?? "default_thumbnail.png",
    imgUrlSmall: smallestPreviewUrl,
    aspectRatio,
  };
}
