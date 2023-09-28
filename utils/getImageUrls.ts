import { Post, Resolution } from "../types/Post";

const getAspectRatio = (width: number | null, height: number | null) => {
  return width && height ? width / height : undefined;
};
const getMobileImage = (resolutions: Resolution[], imgUrl: string) => {
  let res = imgUrl;
  if (resolutions && resolutions.length) {
    for (let i = 0; i < resolutions.length; i++) {
      if (resolutions[i].width > 360) {
        res = resolutions[i].url;
        break;
      }
      res = resolutions[i].url; // if all images are smaller than 360px wide
    }
  }
  return res;
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
  let mobileImgUrl;

  // If there's a 'preview' field, use that bc Reddit maintains those images
  if (preview) {
    const imgObject = preview.images[0];
    const { source, resolutions } = imgObject;
    imgUrl = source ? source.url : imgUrl;
    aspectRatio = getAspectRatio(source.width, source.height) ?? aspectRatio;
    mobileImgUrl = getMobileImage(resolutions, imgUrl);
  }

  return {
    imgUrl,
    thumbnailUrl: thumbnail ?? "default_thumbnail.png",
    mobileImgUrl,
    aspectRatio,
  };
}
