const fs = require("fs");
const dayjs = require("dayjs");

const startDate = dayjs("2010-01-01");
const endDate = dayjs("2022-12-27");

let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate); date = date.add(1, "day")) {
  const formattedDate = date.format("YYYY-MM-DD");
  sitemap += `
  <url>
    <loc>https://www.reddit-time-machine.com/${formattedDate}</loc>
    <lastmod>${formattedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
}

sitemap += "\n</urlset>";

fs.writeFileSync("sitemap.xml", sitemap);
