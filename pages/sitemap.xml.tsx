import { GetServerSideProps } from "next";
import { buildSitemapXml } from "../utils/sitemap";

const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  res.write(buildSitemapXml());
  res.end();

  return { props: {} };
};

export default Sitemap;
