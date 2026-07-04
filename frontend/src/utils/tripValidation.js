const currencyCodeRegex = /^[A-Z]{3}$/;

function isValidDateInput(dateValue) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return false;
  }

  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    year >= 1900 &&
    year <= 2100 &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function validateTripForm(formData) {
  const title = formData.title.trim();
  const destination = formData.destination.trim();
  const currencyCode = formData.currencyCode.trim().toUpperCase();

  if (!title || !destination) {
    return "Title and destination are required.";
  }

  if (!formData.startDate || !formData.endDate) {
    return "Start date and end date are required and must be valid dates.";
  }

  if (!isValidDateInput(formData.startDate) || !isValidDateInput(formData.endDate)) {
    return "Start date and end date must be valid dates.";
  }

  if (new Date(formData.startDate) > new Date(formData.endDate)) {
    return "Start date must be before or equal to end date.";
  }

  if (formData.budget !== "" && Number.isNaN(Number(formData.budget))) {
    return "Budget must be a valid number.";
  }

  if (formData.budget !== "" && Number(formData.budget) < 0) {
    return "Budget cannot be negative.";
  }

  if (formData.budget !== "" && !currencyCode) {
    return "Currency code is required when budget is entered.";
  }

  if (currencyCode && !currencyCodeRegex.test(currencyCode)) {
    return "Currency code must be exactly 3 letters.";
  }

  return "";
}

export function formatApiDateForInput(dateValue) {
  if (!dateValue) {
    return "";
  }

  // The API returns Mongo date strings with a time component, but date inputs need YYYY-MM-DD.
  return dateValue.slice(0, 10);
}
