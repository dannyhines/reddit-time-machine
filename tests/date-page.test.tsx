import { getStaticProps } from "../pages/[date]";

describe("date page routing", () => {
  it.each(["nope", "2022-02-29", "2008-12-31", "2025-01-01"])(
    "returns a real 404 for malformed or out-of-range date %s",
    async (date) => {
      const result = await getStaticProps({ params: { date } } as never);
      expect(result).toEqual({ notFound: true });
    }
  );
});
