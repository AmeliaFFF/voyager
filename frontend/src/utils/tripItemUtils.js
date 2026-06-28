export function formatTripItemLabel(value) {
  if (!value) {
    return "";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function sortTripItemsByDateTime(tripItems) {
  return [...tripItems].sort((firstItem, secondItem) =>
    firstItem.startDateTime.localeCompare(secondItem.startDateTime),
  );
}

export function groupTripItemsByDate(tripItems) {
  return sortTripItemsByDateTime(tripItems).reduce((groupedItems, tripItem) => {
    const dateKey = tripItem.startDateTime.slice(0, 10);

    if (!groupedItems[dateKey]) {
      groupedItems[dateKey] = [];
    }

    groupedItems[dateKey].push(tripItem);

    return groupedItems;
  }, {});
}

export function formatLocalDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const [year, month, day] = dateValue.slice(0, 10).split("-");

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Number(year), Number(month) - 1, Number(day)));
}

export function formatLocalTime(dateTimeValue) {
  if (!dateTimeValue) {
    return "";
  }

  const timePart = dateTimeValue.split("T")[1];
  const [hour, minute] = timePart.split(":").map(Number);

  return new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(2000, 0, 1, hour, minute));
}

export function formatLocalDateTime(dateTimeValue) {
  if (!dateTimeValue) {
    return "";
  }

  const [datePart] = dateTimeValue.split("T");

  return `${formatLocalDate(datePart)}, ${formatLocalTime(dateTimeValue)}`;
}
