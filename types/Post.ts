export interface Post {
  id: string;
  title: string;
  author: string;
  full_link: string;
  url: string;
  subreddit: string;
  score: number;
  preview?: ImagePreview;
  thumbnail?: string;
  thumbnail_height?: number;
  thumbnail_width?: number;
  created_utc: number;
}

interface ImagePreview {
  images: { resolutions: Resolution[] };
  source: Resolution;
}

interface Resolution {
  height: number;
  width: number;
  url: string;
}
