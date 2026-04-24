const PDFDocument = require("pdfkit");
const { formatDate, formatTime } = require("../utils/dateUtils");

// Helper function to capitalise the first letter of a string.
const capitaliseFirstLetter = (value) => {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
};

// Return context-specific labels for start and end times based on trip item type.
const getTimeLabels = (type) => {
    switch (type) {
        case "flight":
        case "cruise":
            return { start: "Departure", end: "Arrival" };
        case "accommodation":
            return { start: "Check-in", end: "Check-out" };
        default:
            return { start: "Start", end: "End" };
    }
};

const generateItineraryPDF = (preparedData, response) => {
    const trip = preparedData.trip;
    const groupedTripItems = preparedData.groupedTripItems;

    // Create a new PDF document.
    const doc = new PDFDocument();

    // Pipe the PDF output directly into the response.
    doc.pipe(response);

    // Add the main title.
    doc.font("Helvetica-Bold").fontSize(22).text(`${trip.title} Itinerary`);
    doc.moveDown();
    doc.font("Helvetica");

    // Add a basic trip summary section.
    doc.font("Helvetica-Bold").fontSize(18).text("Trip Summary");
    doc.font("Helvetica").fontSize(14);
    doc.moveDown(0.5);

    if (trip.startDate) {
        doc.text(`Start Date: ${formatDate(trip.startDate)}`);
    }

    if (trip.endDate) {
        doc.text(`End Date: ${formatDate(trip.endDate)}`);
    }

    if (trip.status) {
        doc.text(`Status: ${capitaliseFirstLetter(trip.status)}`);
    }

    if (trip.notes) {
        doc.text(`Notes: ${trip.notes}`);
    }

    doc.moveDown(2);

    // Add each day and its trip items.
    doc.font("Helvetica-Bold").fontSize(18).text("Daily Itinerary");
    doc.font("Helvetica");
    doc.moveDown(0.5);

    for (const dateKey in groupedTripItems) {
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold").fontSize(16).text(formatDate(dateKey));
        doc.font("Helvetica");
        doc.moveDown(0.5);

        const tripItemsForDay = groupedTripItems[dateKey];

        for (let i = 0; i < tripItemsForDay.length; i++) {
            const tripItem = tripItemsForDay[i];
            const labels = getTimeLabels(tripItem.type);

            doc.font("Helvetica-Bold").fontSize(14).text(`• ${tripItem.title}`);
            doc.font("Helvetica").fontSize(13);

            if (tripItem.type) {
                doc.text(`  Type: ${capitaliseFirstLetter(tripItem.type)}`);
            }

            if (tripItem.status) {
                doc.text(`  Status: ${capitaliseFirstLetter(tripItem.status)}`);
            }

            if (tripItem.provider) {
                doc.text(`  Provider: ${tripItem.provider}`);
            }

            if (tripItem.bookingReference) {
                doc.text(`  Booking Reference: ${tripItem.bookingReference}`);
            }

            if (tripItem.startDateTime) {
                doc.text(`  ${labels.start}: ${formatDate(tripItem.startDateTime)}, ${formatTime(tripItem.startDateTime)}`);
            }

            if (tripItem.endDateTime) {
                doc.text(`  ${labels.end}: ${formatDate(tripItem.endDateTime)}, ${formatTime(tripItem.endDateTime)}`);
            }

            if (tripItem.location) {
                doc.text(`  Location: ${tripItem.location}`);
            }

            if (tripItem.cost !== undefined && tripItem.cost !== null && tripItem.currencyCode) {
                doc.text(`  Cost: ${tripItem.currencyCode} ${tripItem.cost}`);
            }

            if (tripItem.notes) {
                doc.text(`  Notes: ${tripItem.notes}`);
            }

            doc.moveDown(0.5);
        }

        doc.moveDown();
    }

    // Finalise the PDF document.
    doc.end();
};

module.exports = {
    generateItineraryPDF
};