import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TripForm from "./TripForm.jsx";
import { renderWithProviders } from "../test/testUtils.jsx";

const formData = {
  title: "Japan 2026",
  destination: "Japan",
  startDate: "2026-09-01",
  endDate: "2026-09-21",
  status: "planned",
  budget: "5000",
  currencyCode: "AUD",
  notes: "Early autumn trip.",
};

describe("TripForm", () => {
  it("renders trip form fields and primary actions", () => {
    renderWithProviders(
      <TripForm
        formData={formData}
        isSubmitting={false}
        onCancel={vi.fn()}
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        submitButtonLabel="Create trip"
      />,
    );

    expect(screen.getByLabelText(/trip title/i)).toHaveValue("Japan 2026");
    expect(screen.getByLabelText(/primary destination/i)).toHaveValue("Japan");
    expect(screen.getByLabelText(/start date/i)).toHaveValue("2026-09-01");
    expect(screen.getByLabelText(/end date/i)).toHaveValue("2026-09-21");
    expect(screen.getByLabelText(/budget/i)).toHaveValue(5000);
    expect(screen.getByLabelText(/currency code/i)).toHaveValue("AUD");
    expect(screen.getByLabelText(/notes/i)).toHaveValue("Early autumn trip.");
    expect(screen.getByRole("button", { name: /create trip/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete trip/i })).not.toBeInTheDocument();
  });

  it("calls submit, change, cancel, and delete handlers", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((event) => event.preventDefault());
    const handleChange = vi.fn();
    const handleCancel = vi.fn();
    const handleDelete = vi.fn();

    renderWithProviders(
      <TripForm
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

    await user.type(screen.getByLabelText(/trip title/i), " updated");
    await user.click(screen.getByRole("button", { name: /save changes/i }));
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    await user.click(screen.getByRole("button", { name: /delete trip/i }));

    expect(handleChange).toHaveBeenCalled();
    expect(handleSubmit).toHaveBeenCalled();
    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it("shows saving state while submitting", () => {
    renderWithProviders(
      <TripForm
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
