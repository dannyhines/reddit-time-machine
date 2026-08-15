import { NextApiRequest, NextApiResponse } from "next";
import { getPostsForDate } from "../../server/database";
import { isDateInRange, isValidDate } from "../../utils/date-util";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const date = typeof req.query.date === "string" ? req.query.date : "";
  if (!isValidDate(date) || !isDateInRange(date)) {
    return res.status(400).json({ error: "Invalid date" });
  }

  try {
    const posts = await getPostsForDate(date);
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    return res.status(200).json(posts);
  } catch (error: any) {
    console.log("Error in handler for GET /posts:", error);
    return res.status(500).json({ error: error.message });
  }
};

export default handler;
