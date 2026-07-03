import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import TripCard from "./TripCard.jsx";
import { renderWithProviders } from "../test/testUtils.jsx";

const trip = {
  id: "trip-1",
  title: "Japan 2026",
  status: "booked",
  destination: "Japan",
  startDate: "2026-09-01",
  endDate: "2026-09-21",
  budget: 5000,
  currencyCode: "AUD",
  notes: "Tokyo, Osaka, and Hiroshima.",
};

describe("TripCard", () => {
  it("renders trip details and navigation links", () => {
    renderWithProviders(<TripCard trip={trip} />, {
      route: "/trips?status=booked",
    });

    expect(screen.getByRole("heading", { level: 2, name: /japan 2026/i })).toBeInTheDocument();
    expect(screen.getByText("Booked")).toBeInTheDocument();
    expect(screen.getByText("Japan")).toBeInTheDocument();
    expect(screen.getByText("AUD 5,000")).toBeInTheDocument();
    expect(screen.getByText("Tokyo, Osaka, and Hiroshima.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view trip/i })).toHaveAttribute(
      "href",
      "/trips/trip-1",
    );
    expect(screen.getByRole("link", { name: /edit trip/i })).toHaveAttribute(
      "href",
      "/trips/trip-1/edit",
    );
  });

  it("shows fallback text when optional values are missing", () => {
    renderWithProviders(
      <TripCard
        trip={{
          ...trip,
          budget: null,
          notes: "",
        }}
      />,
    );

    expect(screen.getByText("Budget not set")).toBeInTheDocument();
    expect(screen.queryByText("Notes:")).not.toBeInTheDocument();
  });
});
