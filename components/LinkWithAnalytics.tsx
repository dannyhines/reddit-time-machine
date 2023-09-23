import React from "react";
import { sendLinkClickToGA } from "../utils/googleAnalytics";

interface LinkProps {
  url: string;
  text: string;
  type: "reddit" | "external";
  fontSize?: number;
  color?: string;
}

export const LinkWithAnalytics = React.memo(({ url, text, type, fontSize, color }: LinkProps) => {
  const handleClick = () => {
    sendLinkClickToGA(type, url);
  };

  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      onClick={handleClick}
      style={{ fontSize, color: color ?? "inherit" }}
    >
      {text}
    </a>
  );
});

LinkWithAnalytics.displayName = "LinkWithAnalytics";
