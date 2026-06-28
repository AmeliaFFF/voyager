const prepareItineraryData = (payload) => {
    const trip = payload.trip;
    const tripItems = payload.tripItems;

    // Check that trip data exists in the payload; if not, throw an error.
    if (!trip) {
        throw new Error("Trip data is required");
    }

    // Check that tripItems is an array; if not, throw an error.
    if (!Array.isArray(tripItems)) {
        throw new Error("Trip items must be an array");
    }

    // Sort local datetime strings chronologically.
    // YYYY-MM-DDTHH:mm strings sort correctly without Date conversion.
    const sortedTripItems = [...tripItems].sort((a, b) =>
        a.startDateTime.localeCompare(b.startDateTime)
    );

    // Group tripItems by the local date portion of startDateTime.
    const groupedTripItems = {};

    for (let i = 0; i < sortedTripItems.length; i++) {
        const tripItem = sortedTripItems[i];
        const dateKey = tripItem.startDateTime.slice(0, 10);

        // If this date does not exist yet, create an empty array for it.
        if (!groupedTripItems[dateKey]) {
            groupedTripItems[dateKey] = [];
        }

        // Add the trip item to the correct date group.
        groupedTripItems[dateKey].push(tripItem);
    }

    return {
        trip,
        tripItems: sortedTripItems,
        groupedTripItems
    };
};

module.exports = {
    prepareItineraryData
};
