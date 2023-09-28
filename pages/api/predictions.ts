import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { Post } from "../../types/Post";
import { isValidDate } from "../../utils/date-util";
import { POST_COLUMNS } from "../../utils/constants";

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
});

const buildQuery = (year: number) => {
  const currentYear = new Date().getFullYear();
  let byYearConditions: string[] = [];
  // Loop from postYear +1 to currentYear +1 to build the 'by [year]' conditions
  for (let yr = year + 2; yr <= currentYear + 1; yr++) {
    byYearConditions.push(`title ILIKE '%by ${yr}%'`);
    byYearConditions.push(`title ILIKE '%in ${yr}%'`);
  }
  byYearConditions.push(
    "title SIMILAR TO '%in (([1-9]|10|one|two|three|four|five|six|seven|eight|nine|ten) years|the next ([1-9]|10|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|few) (months|years))%'"
  );

  const yearsAgo = Math.max(currentYear - year, 2);
  byYearConditions.push(`title SIMILAR TO '%in ([1-${Math.min(yearsAgo, 9)}]) years%'`);

  let titleCondition = byYearConditions.join(" OR ");

  return `SELECT ${POST_COLUMNS} FROM posts WHERE subreddit = 'Futurology' AND created_date >= $1 AND created_date < $2 AND (${titleCondition}) AND title NOT LIKE '%?' LIMIT 20;`;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { from, to } = req.query;

    if (!isValidDate(from) || !isValidDate(to)) res.status(400).json({ error: "Invalid date(s)" });

    const year = parseInt((to as string).split("-")[0]);
    const query = buildQuery(year);

    const result = await pool.query<Post[]>(query, [from, to]);
    res.status(200).json(result.rows);
    // res.status(200).json({ query: query.replace("$1", `'${from as string}'`).replace("$2", `'${to as string}'`) });
  } catch (error: any) {
    console.log("Error in handler for GET /predictions:", error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;
