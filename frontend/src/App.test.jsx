import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the Voyager app navigation", () => {
    render(<App />);

    const navigation = screen.getByRole("navigation", {
      name: /main navigation/i,
    });

    expect(within(navigation).getByRole("link", { name: /voyager home/i })).toBeInTheDocument();
    expect(within(navigation).getByRole("link", { name: /^home$/i })).toBeInTheDocument();
    expect(within(navigation).getByRole("link", { name: /^trips$/i })).toBeInTheDocument();
  });
});
