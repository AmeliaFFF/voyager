export const tripItemTypeOptions = [
  { value: "flight", label: "Flight" },
  { value: "transport", label: "Transport" },
  { value: "accommodation", label: "Accommodation" },
  { value: "tour", label: "Tour" },
  { value: "cruise", label: "Cruise" },
  { value: "activity", label: "Activity" },
  { value: "other", label: "Other" },
];

export const tripItemStatusOptions = [
  { value: "planned", label: "Planned" },
  { value: "booked", label: "Booked" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const defaultTripItemFormData = {
  type: "",
  status: "planned",
  title: "",
  location: "",
  startDateTime: "",
  endDateTime: "",
  provider: "",
  bookingReference: "",
  cost: "",
  currencyCode: "AUD",
  notes: "",
};
