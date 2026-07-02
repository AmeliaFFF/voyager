import { tripItemStatusOptions, tripItemTypeOptions } from "../constants/tripItemConstants.js";

const currencyCodeRegex = /^[A-Z]{3}$/;
const localDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

const tripItemTypeValues = tripItemTypeOptions.map((typeOption) => typeOption.value);
const tripItemStatusValues = tripItemStatusOptions.map((statusOption) => statusOption.value);

function isValidLocalDateTimeInput(dateTimeValue) {
  if (!localDateTimeRegex.test(dateTimeValue)) {
    return false;
  }

  const [datePart, timePart] = dateTimeValue.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  if (year < 1900 || year > 2100 || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return false;
  }

  const date = new Date(year, month - 1, day, hour, minute);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hour &&
    date.getMinutes() === minute
  );
}

export function validateTripItemForm(formData) {
  const title = formData.title.trim();
  const currencyCode = formData.currencyCode.trim().toUpperCase();

  if (!title) {
    return "Title is required.";
  }

  if (!formData.type || !tripItemTypeValues.includes(formData.type)) {
    return "Type is required.";
  }

  if (!formData.status || !tripItemStatusValues.includes(formData.status)) {
    return "Status is required.";
  }

  if (!formData.startDateTime) {
    return "Start date/time is required.";
  }

  if (!isValidLocalDateTimeInput(formData.startDateTime)) {
    return "Start date/time must be valid.";
  }

  if (formData.endDateTime && !isValidLocalDateTimeInput(formData.endDateTime)) {
    return "End date/time must be valid.";
  }

  if (formData.endDateTime && formData.startDateTime > formData.endDateTime) {
    return "Start date/time must be before or equal to end date/time.";
  }

  if (formData.cost !== "" && Number.isNaN(Number(formData.cost))) {
    return "Cost must be a valid number.";
  }

  if (formData.cost !== "" && Number(formData.cost) < 0) {
    return "Cost cannot be negative.";
  }

  if (formData.cost !== "" && !currencyCode) {
    return "Currency code is required when cost is entered.";
  }

  if (currencyCode && !currencyCodeRegex.test(currencyCode)) {
    return "Currency code must be exactly 3 letters.";
  }

  return "";
}

export function formatApiDateTimeForInput(dateTimeValue) {
  if (!dateTimeValue) {
    return "";
  }

  // The API stores local datetime strings as YYYY-MM-DDTHH:mm, but this also protects against values that include seconds by trimming them for datetime-local inputs.
  return dateTimeValue.slice(0, 16);
}
