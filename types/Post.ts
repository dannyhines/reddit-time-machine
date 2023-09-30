export interface Post {
  id: string;
  title: string;
  url: string;
  created_utc: number;
  author: string;
  domain: string;
  hidden: boolean;
  score: number;
  ups?: number;
  downs?: number;
  is_reddit_media_domain: boolean;
  is_video: boolean;
  num_comments: number;
  num_crossposts?: number;
  permalink: string;
  preview: Preview;
  subreddit: string;
  subreddit_id: string;
  thumbnail?: string;
  thumbnail_height?: number;
  thumbnail_width?: number;
  created_date: string; // YYYY-MM-DD
  post_type: "meme" | "news" | "politics" | "sports" | "science" | "pics" | "prediction";
}

interface Preview {
  enabled: boolean;
  images: PreviewImage[];
}

type VariantType = "png" | "gif" | "mp4" | "nsfw" | "obfuscated";

interface PreviewImage {
  resolutions: Resolution[];
  source: Resolution;
  variants?: { [K in VariantType]: PreviewImage };
}

export interface Resolution {
  height: number;
  width: number;
  url: string;
}
