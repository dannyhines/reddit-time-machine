import { Post, Resolution } from "../types/Post";

const getAspectRatio = (width?: number, height?: number) => {
  return width && height ? width / height : undefined;
};

const getSrcSet = (resolutions: Resolution[]) => {
  return resolutions.map((res) => `${res.url} ${res.width}w`).join(", ");
};

/*
 * returns the image urls, calculates w/h (aspect ratio)
 * older posts don't contain a 'preview' field, thumbnail width & height
 * // TODO: use is_video, is_reddit_media_domain, preview.variants?
 */
export function getImageUrls(post?: Post) {
  if (!post || !post.url) return { src: "" };
  let { url, thumbnail, preview, thumbnail_width, thumbnail_height } = post;
  let aspectRatio = getAspectRatio(thumbnail_width, thumbnail_height);

  thumbnail = thumbnail && thumbnail !== "default" ? thumbnail.replace("http://", "https://") : undefined; // most are 'default'
  let postUrl = url.replace("http://", "https://") ?? undefined;
  let placeholder, srcSet, srcSet_Gif, previewUrl, previewUrl_Gif;

  // If there's a 'preview' field, use that bc Reddit maintains those images
  if (preview) {
    const { source, resolutions, variants } = preview.images[0];
    previewUrl = source ? source.url : postUrl;
    previewUrl_Gif = variants?.gif?.source?.url;
    aspectRatio = getAspectRatio(source.width, source.height) ?? aspectRatio;
    // placeholder = getMobileImage(resolutions, postUrl);
    placeholder = resolutions[0].url;
    srcSet = getSrcSet(resolutions);
    if (variants?.gif?.resolutions) {
      srcSet_Gif = variants.gif.resolutions.map((res) => `${res.url} ${res.width}w`).join(", ");
    }
  }

  return {
    aspectRatio,
    imgSrc: !srcSet ? postUrl : undefined,
    thumbnail,
    placeholder,
    srcSet: srcSet_Gif ?? srcSet,
    previewUrl: previewUrl_Gif ?? previewUrl,
  };
}
