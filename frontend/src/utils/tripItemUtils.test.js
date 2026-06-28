import { describe, expect, it } from "vitest";
import {
  formatLocalDate,
  formatLocalDateTime,
  formatLocalTime,
  groupTripItemsByDate,
  sortTripItemsByDateTime,
} from "./tripItemUtils.js";

const unsortedTripItems = [
  {
    id: "3",
    title: "Evening activity",
    startDateTime: "2026-09-02T20:00",
  },
  {
    id: "1",
    title: "Morning flight",
    startDateTime: "2026-09-01T10:00",
  },
  {
    id: "2",
    title: "Hotel check-in",
    startDateTime: "2026-09-01T15:00",
  },
];

describe("sortTripItemsByDateTime", () => {
  it("sorts trip items chronologically by local datetime string", () => {
    const sortedItems = sortTripItemsByDateTime(unsortedTripItems);

    expect(sortedItems.map((tripItem) => tripItem.title)).toEqual([
      "Morning flight",
      "Hotel check-in",
      "Evening activity",
    ]);
  });
});

describe("groupTripItemsByDate", () => {
  it("groups sorted trip items by local date", () => {
    const groupedItems = groupTripItemsByDate(unsortedTripItems);

    expect(Object.keys(groupedItems)).toEqual(["2026-09-01", "2026-09-02"]);
    expect(groupedItems["2026-09-01"].map((tripItem) => tripItem.title)).toEqual([
      "Morning flight",
      "Hotel check-in",
    ]);
    expect(groupedItems["2026-09-02"].map((tripItem) => tripItem.title)).toEqual([
      "Evening activity",
    ]);
  });
});

describe("formatLocalDate", () => {
  it("formats a local date string for display", () => {
    expect(formatLocalDate("2026-09-01")).toBe("1 September 2026");
  });
});

describe("formatLocalTime", () => {
  it("formats a local datetime string time without timezone conversion", () => {
    expect(formatLocalTime("2026-09-02T23:30")).toBe("11:30 pm");
  });
});

describe("formatLocalDateTime", () => {
  it("formats a local datetime string without timezone conversion", () => {
    expect(formatLocalDateTime("2026-09-02T23:30")).toBe("2 September 2026, 11:30 pm");
  });
});
