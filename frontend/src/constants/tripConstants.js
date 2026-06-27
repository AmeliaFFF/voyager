export const tripStatusOptions = [
  {
    value: "planned",
    label: "Planned",
  },
  {
    value: "booked",
    label: "Booked",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

export const defaultTripFormData = {
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  status: "planned",
  budget: "",
  currencyCode: "AUD",
  notes: "",
};
