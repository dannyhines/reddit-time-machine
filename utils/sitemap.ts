import { getArchiveDates, getArchiveMonths } from "./archive";

const BASE_URL = "https://www.reddit-time-machine.com";

export const getSitemapUrls = () => [
  BASE_URL,
  `${BASE_URL}/archive`,
  ...getArchiveMonths().map(({ year, month }) => `${BASE_URL}/archive/${year}/${month}`),
  ...getArchiveDates().map((date) => `${BASE_URL}/${date}`),
];

export const buildSitemapXml = () => {
  const urls = getSitemapUrls().map((url) => `  <url><loc>${url}</loc></url>`);
  return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, "</urlset>"].join("\n");
};
