import { Post } from "../types/Post";

/*
 *
 * returns the src & thumbnail images, calculates w/h (aspect ratio)
 * // TODO: use is_video, is_reddit_media_domain, preview.variants?
 */
export function getImageUrls(post?: Post) {
  if (!post || !post.url) return { src: "" };
  let { url, thumbnail, preview, thumbnail_width, thumbnail_height } = post;
  let aspectRatio = (thumbnail_width ?? 400) / (thumbnail_height ?? 300);

  url = url.replace("http://", "https://") ?? "";
  thumbnail = thumbnail && thumbnail !== "default" ? thumbnail : null; // most are 'default'
  let smallestPreviewUrl = thumbnail;

  if (preview) {
    const imgObject = preview.images[0];
    const { source, resolutions } = imgObject;
    aspectRatio = source.width / source.height;
    smallestPreviewUrl = resolutions && resolutions.length ? resolutions[0].url : null;
  }

  return {
    imgUrl: url,
    thumbnailUrl: thumbnail,
    imgUrlSmall: smallestPreviewUrl,
    aspectRatio,
  };
}
