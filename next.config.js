// const withAntdLess = require("next-plugin-antd-less");
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
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
    ];
  },
  // images: {
  //   domains: ["i.redd.it", "i.imgur.com", "imgur.com", "tumblr.com", "memegenerator.net"],
  // },
};

module.exports = nextConfig;
