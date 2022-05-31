import fs from "fs";

const writeToCsv = async (filename, posts) => {
  console.log("adding " + tweets.length + " tweets to " + filename);
  try {
    let csvString = !fs.existsSync(filename) ? "id,created_at,author_id,text\n" : "";
    tweets.forEach((tweet) => {
      csvString += `${tweet.id},${tweet.created_at},${tweet.author_id},${tweet.text.replace(/\n/g, "\\n")}\n`;
    });
    await fsp.appendFile(filename, csvString);
  } catch (err) {
    console.error(`Failed to write to '${filename}'. Error: ${err.message}`, fields, err);
  }
};
