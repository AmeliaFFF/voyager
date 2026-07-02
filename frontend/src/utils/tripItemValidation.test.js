import { describe, expect, it } from "vitest";
import { formatApiDateTimeForInput, validateTripItemForm } from "./tripItemValidation.js";

const validFormData = {
  title: "Flight to Tokyo",
  type: "flight",
  status: "booked",
  location: "Brisbane Airport",
  startDateTime: "2026-02-26T09:45",
  endDateTime: "2026-02-26T18:30",
  provider: "Voyager Airways",
  bookingReference: "DEMO-JP-FLT1",
  cost: "1450",
  currencyCode: "AUD",
  notes: "",
};

describe("validateTripItemForm", () => {
  it("returns an empty string for valid trip item data", () => {
    expect(validateTripItemForm(validFormData)).toBe("");
  });

  it("requires a title", () => {
    expect(validateTripItemForm({ ...validFormData, title: "" })).toBe("Title is required.");
  });

  it("requires a valid type", () => {
    expect(validateTripItemForm({ ...validFormData, type: "" })).toBe("Type is required.");
  });

  it("requires a valid status", () => {
    expect(validateTripItemForm({ ...validFormData, status: "" })).toBe("Status is required.");
  });

  it("requires a start date/time", () => {
    expect(validateTripItemForm({ ...validFormData, startDateTime: "" })).toBe(
      "Start date/time is required.",
    );
  });

  it("allows end date/time to be empty", () => {
    expect(validateTripItemForm({ ...validFormData, endDateTime: "" })).toBe("");
  });

  it("validates end date/time when it is entered", () => {
    expect(validateTripItemForm({ ...validFormData, endDateTime: "not-a-date" })).toBe(
      "End date/time must be valid.",
    );
  });

  it("requires start date/time to be before or equal to end date/time", () => {
    expect(
      validateTripItemForm({
        ...validFormData,
        startDateTime: "2026-02-26T18:30",
        endDateTime: "2026-02-26T09:45",
      }),
    ).toBe("Start date/time must be before or equal to end date/time.");
  });

  it("does not allow a negative cost", () => {
    expect(validateTripItemForm({ ...validFormData, cost: "-1" })).toBe("Cost cannot be negative.");
  });

  it("requires a currency code when cost is entered", () => {
    expect(validateTripItemForm({ ...validFormData, cost: "100", currencyCode: "" })).toBe(
      "Currency code is required when cost is entered.",
    );
  });

  it("requires currency code to be exactly 3 letters", () => {
    expect(validateTripItemForm({ ...validFormData, currencyCode: "AU" })).toBe(
      "Currency code must be exactly 3 letters.",
    );
  });
});

describe("formatApiDateTimeForInput", () => {
  it("returns an empty string when no value is provided", () => {
    expect(formatApiDateTimeForInput("")).toBe("");
  });

  it("formats datetime strings for datetime-local inputs", () => {
    expect(formatApiDateTimeForInput("2026-02-26T09:45:30.000Z")).toBe("2026-02-26T09:45");
  });
});
