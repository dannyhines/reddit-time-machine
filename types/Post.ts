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
