export const formatScore = (score: number) => {
  return score >= 1000 ? Math.round(score / 1000) + "k" : score;
};
