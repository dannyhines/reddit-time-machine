import {
  FIRST_ARCHIVE_DATE,
  LAST_ARCHIVE_DATE,
  getAdjacentArchiveDates,
  getArchiveDates,
  getArchiveMonths,
  getDatesForArchiveMonth,
} from "./archive";

describe("archive routing", () => {
  it("uses the complete verified archive range", () => {
    const dates = getArchiveDates();

    expect(FIRST_ARCHIVE_DATE).toBe("2009-01-01");
    expect(LAST_ARCHIVE_DATE).toBe("2022-12-31");
    expect(dates).toHaveLength(5113);
    expect(dates[0]).toBe(FIRST_ARCHIVE_DATE);
    expect(dates.at(-1)).toBe(LAST_ARCHIVE_DATE);
  });

  it("creates crawlable month archives", () => {
    expect(getArchiveMonths()).toHaveLength(168);
    expect(getDatesForArchiveMonth("2014", "07")).toHaveLength(31);
  });

  it("does not link beyond the archive boundaries", () => {
    expect(getAdjacentArchiveDates(FIRST_ARCHIVE_DATE)).toEqual({ previous: null, next: "2009-01-02" });
    expect(getAdjacentArchiveDates(LAST_ARCHIVE_DATE)).toEqual({ previous: "2022-12-30", next: null });
  });
});
