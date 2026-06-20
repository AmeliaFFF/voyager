import { beforeEach, describe, expect, it } from "vitest";
import { getToken, removeToken, saveToken } from "./tokenStorage.js";

describe("tokenStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and retrieves a token", () => {
    saveToken("test-token");

    expect(getToken()).toBe("test-token");
  });

  it("removes a token", () => {
    saveToken("test-token");

    removeToken();

    expect(getToken()).toBeNull();
  });
});
