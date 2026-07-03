import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TripItemForm from "./TripItemForm.jsx";
import { renderWithProviders } from "../test/testUtils.jsx";

const formData = {
  type: "flight",
  status: "booked",
  title: "Flight to Tokyo",
  location: "Brisbane Airport",
  startDateTime: "2026-09-01T09:30",
  endDateTime: "2026-09-01T18:15",
  provider: "Qantas",
  bookingReference: "ABC123",
  cost: "1450",
  currencyCode: "AUD",
  notes: "Window seat.",
};

describe("TripItemForm", () => {
  it("renders itinerary item form fields and primary actions", () => {
    renderWithProviders(
      <TripItemForm
        formData={formData}
        isSubmitting={false}
        onCancel={vi.fn()}
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        submitButtonLabel="Create item"
      />,
    );

    expect(screen.getByLabelText(/item title/i)).toHaveValue("Flight to Tokyo");
    expect(screen.getByLabelText(/start date and time/i)).toHaveValue("2026-09-01T09:30");
    expect(screen.getByLabelText(/end date and time/i)).toHaveValue("2026-09-01T18:15");
    expect(screen.getByLabelText(/location/i)).toHaveValue("Brisbane Airport");
    expect(screen.getByLabelText(/provider/i)).toHaveValue("Qantas");
    expect(screen.getByLabelText(/booking reference/i)).toHaveValue("ABC123");
    expect(screen.getByLabelText(/cost/i)).toHaveValue(1450);
    expect(screen.getByLabelText(/currency code/i)).toHaveValue("AUD");
    expect(screen.getByLabelText(/notes/i)).toHaveValue("Window seat.");
    expect(screen.getByRole("button", { name: /create item/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete item/i })).not.toBeInTheDocument();
  });

  it("calls submit, change, cancel, and delete handlers", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((event) => event.preventDefault());
    const handleChange = vi.fn();
    const handleCancel = vi.fn();
    const handleDelete = vi.fn();

    renderWithProviders(
      <TripItemForm
        formData={formData}
        isSubmitting={false}
        onCancel={handleCancel}
        onChange={handleChange}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
        showDeleteButton
        submitButtonLabel="Save changes"
      />,
    );

    await user.type(screen.getByLabelText(/item title/i), " updated");
    await user.click(screen.getByRole("button", { name: /save changes/i }));
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    await user.click(screen.getByRole("button", { name: /delete item/i }));

    expect(handleChange).toHaveBeenCalled();
    expect(handleSubmit).toHaveBeenCalled();
    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it("shows saving state while submitting", () => {
    renderWithProviders(
      <TripItemForm
        formData={formData}
        isSubmitting
        onCancel={vi.fn()}
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        submitButtonLabel="Save changes"
      />,
    );

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });
});
