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

    // Sort tripItems by startDateTime.
    const sortedTripItems = [...tripItems].sort((a, b) => {
        // Convert startDateTime to Date objects for comparison.
        const dateA = new Date(a.startDateTime);
        const dateB = new Date(b.startDateTime);
        // Sort in ascending order (earliest first).
        return dateA - dateB;
    })

    // Group tripItems by day.
    const groupedTripItems = {};
    
    for (let i = 0; i < sortedTripItems.length; i++) {
        const tripItem = sortedTripItems[i];
        const date = new Date(tripItem.startDateTime);

        // Create a date key in YYYY-MM-DD format using local date parts.
        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

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