import { describe, expect, it } from "vitest";
import { formatStatusLabel, sortTripsByStatusAndDate } from "./statusUtils.js";

describe("formatStatusLabel", () => {
  it("capitalises the first letter of a status", () => {
    expect(formatStatusLabel("planned")).toBe("Planned");
  });

  it("returns an empty string when status is missing", () => {
    expect(formatStatusLabel()).toBe("");
  });
});

describe("sortTripsByStatusAndDate", () => {
  it("sorts trips by status order and then start date", () => {
    const trips = [
      {
        title: "Cancelled Trip",
        status: "cancelled",
        startDate: "2026-03-01",
      },
      {
        title: "Booked Later",
        status: "booked",
        startDate: "2026-06-01",
      },
      {
        title: "Planned Trip",
        status: "planned",
        startDate: "2026-09-01",
      },
      {
        title: "Booked Earlier",
        status: "booked",
        startDate: "2026-05-01",
      },
    ];

    const sortedTrips = sortTripsByStatusAndDate(trips);

    expect(sortedTrips.map((trip) => trip.title)).toEqual([
      "Planned Trip",
      "Booked Earlier",
      "Booked Later",
      "Cancelled Trip",
    ]);
  });
});
