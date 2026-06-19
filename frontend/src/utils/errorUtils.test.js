import { describe, expect, it } from "vitest";
import { getErrorMessage } from "./errorUtils.js";

describe("getErrorMessage", () => {
  it("returns a fallback message when error is missing", () => {
    expect(getErrorMessage()).toBe("Something went wrong. Please try again.");
  });

  it("returns the string when the error is a string", () => {
    expect(getErrorMessage("Invalid login details.")).toBe("Invalid login details.");
  });

  it("returns the message from an Error object", () => {
    expect(getErrorMessage(new Error("Trip not found."))).toBe("Trip not found.");
  });
});
