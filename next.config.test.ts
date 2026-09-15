const nextConfig = require("./next.config.js");

describe("legacy URL redirects", () => {
  it("permanently redirects stale Reddit routes and the old index document", async () => {
    await expect(nextConfig.redirects()).resolves.toEqual(
      expect.arrayContaining([
        {
          source: "/r/:path*",
          destination: "https://www.reddit.com/r/:path*",
          permanent: true,
        },
        {
          source: "/index.html",
          destination: "/",
          permanent: true,
        },
      ])
    );
  });
});
