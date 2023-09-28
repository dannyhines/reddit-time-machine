import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { Post } from "../../types/Post";

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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const date = req.query.date;
    const result = await pool.query<Post[]>(`SELECT * FROM top_posts WHERE created_date = $1;`, [date]);
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.log("Error in handler for GET /posts:", error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;
