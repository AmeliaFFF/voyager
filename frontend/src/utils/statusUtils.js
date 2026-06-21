// Shows active/upcoming trips before historical or cancelled trips on the dashboard.
const tripStatusOrder = {
  planned: 1,
  booked: 2,
  completed: 3,
  cancelled: 4,
};

export function formatStatusLabel(status) {
  if (!status) {
    return "";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function sortTripsByStatusAndDate(trips) {
  return [...trips].sort((firstTrip, secondTrip) => {
    const firstStatusOrder = tripStatusOrder[firstTrip.status] || 99;
    const secondStatusOrder = tripStatusOrder[secondTrip.status] || 99;

    if (firstStatusOrder !== secondStatusOrder) {
      return firstStatusOrder - secondStatusOrder;
    }

    return new Date(firstTrip.startDate) - new Date(secondTrip.startDate);
  });
}
