import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import HomePage from "./HomePage.jsx";
import { renderWithProviders } from "../test/testUtils.jsx";

describe("HomePage", () => {
  it("renders the home page heading and trips link", () => {
    renderWithProviders(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /plan your next adventure with voyager/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view trips/i })).toHaveAttribute("href", "/trips");
  });
});
