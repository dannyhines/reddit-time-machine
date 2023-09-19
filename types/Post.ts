// export interface Post {
//   id: string;
//   title: string;
//   author: string;
//   full_link: string;
//   url: string;
//   subreddit: string;
//   score: number;
//   preview?: ImagePreview;
//   thumbnail?: string;
//   thumbnail_height?: number;
//   thumbnail_width?: number;
//   created_utc: number;
// }

export interface Post {
  id: string;
  title: string;
  url: string;
  created_utc: number;
  author: string;
  domain: string;
  hidden: boolean;
  score: number;
  ups: number | null;
  downs: number | null;
  is_reddit_media_domain: boolean;
  is_video: boolean;
  num_comments: number;
  num_crossposts: number | null;
  permalink: string;
  preview: Preview;
  subreddit: string;
  subreddit_id: string;
  thumbnail: string | null;
  thumbnail_height: number | null;
  thumbnail_width: number | null;
  created_date: string; // YYYY-MM-DD
  post_type: "meme" | "news" | "politics" | "sports" | "science" | "pics";
}

interface Preview {
  enabled: boolean;
  images: PreviewImage[];
}

interface PreviewImage {
  resolutions: Resolution[];
  source: Resolution;
  variants?: { [variant: string]: PreviewImage[] }[];
}

interface Resolution {
  height: number;
  width: number;
  url: string;
}
