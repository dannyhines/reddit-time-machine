import { isDateInRange, isValidDate } from "./date-util";

describe("archive date validation", () => {
  it.each(["2022-02-29", "2022-04-31", "2022-13-01", "not-a-date"])("rejects invalid date %s", (date) => {
    expect(isValidDate(date)).toBe(false);
    expect(isDateInRange(date)).toBe(false);
  });

  it("includes both archive boundaries", () => {
    expect(isDateInRange("2009-01-01")).toBe(true);
    expect(isDateInRange("2022-12-27")).toBe(true);
  });

  it.each(["2008-12-31", "2022-12-28", "2025-01-01"])("rejects out-of-range date %s", (date) => {
    expect(isDateInRange(date)).toBe(false);
  });
});
