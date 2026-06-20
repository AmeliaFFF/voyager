import { describe, expect, it } from "vitest";
import { validateLoginForm, validateRegisterForm } from "./authValidation.js";

describe("validateLoginForm", () => {
  it("requires email and password", () => {
    expect(validateLoginForm({ email: "", password: "" })).toBe("Email and password are required.");
  });

  it("requires a valid email address", () => {
    expect(validateLoginForm({ email: "invalid-email", password: "Password123" })).toBe(
      "A valid email address is required.",
    );
  });

  it("returns an empty string when login details are valid", () => {
    expect(validateLoginForm({ email: "test@example.com", password: "Password123" })).toBe("");
  });
});

describe("validateRegisterForm", () => {
  it("requires name, email, and password", () => {
    expect(validateRegisterForm({ name: "", email: "", password: "" })).toBe(
      "Name, email, and password are required.",
    );
  });

  it("requires a password with at least 8 characters", () => {
    expect(
      validateRegisterForm({
        name: "Test",
        email: "test@example.com",
        password: "Pass1",
      }),
    ).toBe("Password must be at least 8 characters long.");
  });

  it("requires password complexity", () => {
    expect(
      validateRegisterForm({
        name: "Test",
        email: "test@example.com",
        password: "password",
      }),
    ).toBe(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    );
  });

  it("returns an empty string when registration details are valid", () => {
    expect(
      validateRegisterForm({
        name: "Test",
        email: "test@example.com",
        password: "Password123",
      }),
    ).toBe("");
  });
});
