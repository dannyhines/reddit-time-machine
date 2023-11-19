export interface Post {
  id: string;
  title: string;
  url: string;
  created_utc: number;
  author: string;
  domain: string;
  hidden?: boolean;
  score: number;
  ups?: null | number;
  downs?: null | number;
  is_reddit_media_domain?: boolean;
  is_video?: boolean;
  num_comments?: number;
  num_crossposts?: null | number;
  permalink: string;
  preview?: null | Preview;
  subreddit: string;
  subreddit_id?: string;
  thumbnail?: null | string;
  thumbnail_height?: null | number;
  thumbnail_width?: null | number;
  created_date: string; // YYYY-MM-DD
  post_type: "meme" | "news" | "politics" | "sports" | "science" | "pics" | "prediction";
}

interface Preview {
  enabled: boolean;
  images: PreviewImage[];
  reddit_video_preview?: RedditVideoPreview;
}

type VariantType = "png" | "gif" | "mp4" | "nsfw" | "obfuscated";

interface PreviewImage {
  id?: string;
  resolutions: Resolution[];
  source: Resolution;
  variants?: null | { [K in VariantType]?: PreviewImage };
}

export interface Resolution {
  height: number;
  width: number;
  url: string;
}

// this one is rarely included
interface RedditVideoPreview {
  bitrate_kbps: number; // 1200;
  dash_url: string;
  duration: number; // 4;
  fallback_url: string;
  height: number; // 480;
  hls_url: string;
  is_gif: true;
  scrubber_media_url: string;
  transcoding_status: string; // "completed";
  width: number; // 480;
}
