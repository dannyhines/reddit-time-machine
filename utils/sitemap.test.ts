import { buildSitemapXml, getSitemapUrls } from "./sitemap";

describe("sitemap", () => {
  it("includes every date and archive navigation page", () => {
    const urls = getSitemapUrls();

    expect(urls).toHaveLength(5283);
    expect(urls).toContain("https://www.reddit-time-machine.com/2009-01-01");
    expect(urls).toContain("https://www.reddit-time-machine.com/2022-12-31");
    expect(urls).toContain("https://www.reddit-time-machine.com/archive/2014/07");
  });

  it("returns valid sitemap-shaped XML without duplicate URLs", () => {
    const urls = getSitemapUrls();
    const xml = buildSitemapXml();

    expect(new Set(urls).size).toBe(urls.length);
    expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>/);
    expect(xml).toContain("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");
    expect(xml).toContain("<loc>https://www.reddit-time-machine.com/2014-07-04</loc>");
  });
});
