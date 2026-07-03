import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import FeedbackMessage from "./FeedbackMessage.jsx";
import { renderWithProviders } from "../test/testUtils.jsx";

describe("FeedbackMessage", () => {
  it("renders feedback content as an alert", () => {
    renderWithProviders(<FeedbackMessage>Something went wrong.</FeedbackMessage>);

    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong.");
  });

  it("renders success messages as alerts", () => {
    renderWithProviders(<FeedbackMessage severity="success">Trip saved.</FeedbackMessage>);

    expect(screen.getByRole("alert")).toHaveTextContent("Trip saved.");
  });
});
