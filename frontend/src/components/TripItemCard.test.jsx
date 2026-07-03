import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import TripItemCard from "./TripItemCard.jsx";
import { renderWithProviders } from "../test/testUtils.jsx";

const tripItem = {
  id: "item-1",
  tripId: "trip-1",
  title: "Flight to Tokyo",
  type: "flight",
  status: "booked",
  startDateTime: "2026-09-01T09:30",
  endDateTime: "2026-09-01T18:15",
  location: "Brisbane Airport",
  provider: "Qantas",
  bookingReference: "ABC123",
  cost: 1450,
  currencyCode: "AUD",
  notes: "Window seat.",
};

describe("TripItemCard", () => {
  it("renders itinerary item details and edit link", () => {
    renderWithProviders(<TripItemCard tripItem={tripItem} />, {
      route: "/trips/trip-1?type=flight",
    });

    expect(screen.getByRole("heading", { level: 4, name: /flight to tokyo/i })).toBeInTheDocument();
    expect(screen.getByText("Flight")).toBeInTheDocument();
    expect(screen.getByText("Booked")).toBeInTheDocument();
    expect(screen.getByText("1 September 2026, 9:30 am")).toBeInTheDocument();
    expect(screen.getByText("1 September 2026, 6:15 pm")).toBeInTheDocument();
    expect(screen.getByText("Brisbane Airport")).toBeInTheDocument();
    expect(screen.getByText("Qantas")).toBeInTheDocument();
    expect(screen.getByText("ABC123")).toBeInTheDocument();
    expect(screen.getByText("AUD 1,450")).toBeInTheDocument();
    expect(screen.getByText("Window seat.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /edit item/i })).toHaveAttribute(
      "href",
      "/trips/trip-1/items/item-1/edit",
    );
  });

  it("uses accommodation-specific time labels", () => {
    renderWithProviders(
      <TripItemCard
        tripItem={{
          ...tripItem,
          title: "Hotel stay",
          type: "accommodation",
          startDateTime: "2026-09-01T15:00",
          endDateTime: "2026-09-03T10:00",
        }}
      />,
    );

    expect(screen.getByText("Check-in:")).toBeInTheDocument();
    expect(screen.getByText("Check-out:")).toBeInTheDocument();
  });

  it("shows fallback text when the end date/time is missing", () => {
    renderWithProviders(
      <TripItemCard
        tripItem={{
          ...tripItem,
          endDateTime: "",
        }}
      />,
    );

    expect(screen.getByText("Arrival:")).toBeInTheDocument();
    expect(screen.getByText("Not set")).toBeInTheDocument();
  });
});
