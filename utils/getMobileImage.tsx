import { Resolution } from "../types/Post";

/*
  Returns the smallest preview image with a width >= mobile screen widths
  */
export const getMobileImage = (resolutions: Resolution[], imgUrl: string) => {
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
