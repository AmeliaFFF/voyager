import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import NotFoundPage from "./NotFoundPage.jsx";
import { renderWithProviders } from "../test/testUtils.jsx";

describe("NotFoundPage", () => {
  it("renders a not found message and home link", () => {
    renderWithProviders(<NotFoundPage />);

    expect(screen.getByRole("heading", { name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /go home/i })).toHaveAttribute("href", "/");
  });
});
