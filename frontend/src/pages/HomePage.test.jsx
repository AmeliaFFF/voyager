import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import HomePage from "./HomePage.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { renderWithProviders } from "../test/testUtils.jsx";

vi.mock("../hooks/useAuth.js", () => ({
  useAuth: vi.fn(),
}));

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders public calls to action for logged out users", () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    renderWithProviders(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: /plan your next adventure with voyager/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /create an account/i })).toHaveAttribute(
      "href",
      "/register",
    );

    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute("href", "/login");
  });

  it("renders trip actions for logged in users", () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: {
        name: "Username",
      },
    });

    renderWithProviders(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: /welcome back, username/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /view my trips/i })).toHaveAttribute("href", "/trips");

    expect(screen.getByRole("link", { name: /create a trip/i })).toHaveAttribute(
      "href",
      "/trips/new",
    );
  });

  it("renders the value and workflow sections", () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    renderWithProviders(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: /a clearer way to organise travel/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /how voyager works/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /one home for every plan/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /see what needs doing/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /take your itinerary with you/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: /create a trip/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /build the itinerary/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /update and export anytime/i })).toBeInTheDocument();
  });
});
