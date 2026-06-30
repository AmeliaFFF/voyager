const fs = require("node:fs");
const path = require("node:path");
const PDFDocument = require("pdfkit");
const { formatDate, formatTime } = require("../utils/dateUtils");

const LOGO_PATH = path.join(__dirname, "../assets/voyager-logo.png");
const LOGO_WIDTH = 110;
const LOGO_HEIGHT = 45;

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

const addFirstPageHeader = (doc, tripTitle) => {
    const top = doc.page.margins.top;
    const left = doc.page.margins.left;
    const right = doc.page.width - doc.page.margins.right;
    const hasLogo = fs.existsSync(LOGO_PATH);

    if (hasLogo) {
        doc.image(LOGO_PATH, right - LOGO_WIDTH, top, {
            fit: [LOGO_WIDTH, LOGO_HEIGHT]
        });
    }

    const titleTop = hasLogo ? top + LOGO_HEIGHT + 24 : top;
    const titleWidth = right - left;

    doc.font("Helvetica-Bold")
        .fontSize(22)
        .text(`${tripTitle} Itinerary`, left, titleTop, {
            width: titleWidth
        });

    doc.x = left;
    doc.moveDown();
};

const generateItineraryPDF = (preparedData, response) => {
    const trip = preparedData.trip;
    const groupedTripItems = preparedData.groupedTripItems;

    // Create a new PDF document.
    const doc = new PDFDocument();

    // Pipe the PDF output directly into the response.
    doc.pipe(response);

    addFirstPageHeader(doc, trip.title);

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

    const itineraryDateKeys = Object.keys(groupedTripItems);

    if (itineraryDateKeys.length === 0) {
        doc.font("Helvetica")
            .fontSize(13)
            .text("No itinerary items have been added yet.");
        doc.moveDown();
    }

    for (const dateKey of itineraryDateKeys) {
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
                doc.text(
                    `  ${labels.start}: ${formatDate(tripItem.startDateTime)}, ${formatTime(tripItem.startDateTime)}`
                );
            }

            if (tripItem.endDateTime) {
                doc.text(
                    `  ${labels.end}: ${formatDate(tripItem.endDateTime)}, ${formatTime(tripItem.endDateTime)}`
                );
            }

            if (tripItem.location) {
                doc.text(`  Location: ${tripItem.location}`);
            }

            if (
                tripItem.cost !== undefined &&
                tripItem.cost !== null &&
                tripItem.currencyCode
            ) {
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
