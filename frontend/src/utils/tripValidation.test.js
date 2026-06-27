import { describe, expect, it } from "vitest";
import { formatApiDateForInput, validateTripForm } from "./tripValidation.js";

const validTripFormData = {
  title: "Japan 2026",
  destination: "Japan",
  startDate: "2026-09-01",
  endDate: "2026-09-21",
  status: "planned",
  budget: "5000",
  currencyCode: "AUD",
  notes: "Early Autumn trip.",
};

describe("validateTripForm", () => {
  it("requires title and destination", () => {
    expect(
      validateTripForm({
        ...validTripFormData,
        title: "",
      }),
    ).toBe("Title and destination are required.");
  });

  it("requires start date and end date", () => {
    expect(
      validateTripForm({
        ...validTripFormData,
        startDate: "",
      }),
    ).toBe("Start date and end date are required and must be valid dates.");
  });

  it("does not allow start date after end date", () => {
    expect(
      validateTripForm({
        ...validTripFormData,
        startDate: "2026-09-21",
        endDate: "2026-09-01",
      }),
    ).toBe("Start date must be before or equal to end date.");
  });

  it("requires dates to be valid dates between 1900 and 2100", () => {
    expect(
      validateTripForm({
        ...validTripFormData,
        startDate: "0001-09-01",
      }),
    ).toBe("Start date and end date must be valid dates.");
  });

  it("does not allow impossible calendar dates", () => {
    expect(
      validateTripForm({
        ...validTripFormData,
        startDate: "2026-02-31",
      }),
    ).toBe("Start date and end date must be valid dates.");
  });

  it("formats API date values for date inputs", () => {
    expect(formatApiDateForInput("2026-09-01T00:00:00.000Z")).toBe("2026-09-01");
  });

  it("does not allow a negative budget", () => {
    expect(
      validateTripForm({
        ...validTripFormData,
        budget: "-100",
      }),
    ).toBe("Budget cannot be negative.");
  });

  it("requires currency code when budget is entered", () => {
    expect(
      validateTripForm({
        ...validTripFormData,
        budget: "5000",
        currencyCode: "",
      }),
    ).toBe("Currency code is required when budget is entered.");
  });

  it("requires currency code to be exactly 3 letters when provided", () => {
    expect(
      validateTripForm({
        ...validTripFormData,
        currencyCode: "AUDD",
      }),
    ).toBe("Currency code must be exactly 3 letters.");
  });

  it("allows currency code to be blank when budget is blank", () => {
    expect(
      validateTripForm({
        ...validTripFormData,
        budget: "",
        currencyCode: "",
      }),
    ).toBe("");
  });

  it("returns an empty string when trip details are valid", () => {
    expect(validateTripForm(validTripFormData)).toBe("");
  });
});
