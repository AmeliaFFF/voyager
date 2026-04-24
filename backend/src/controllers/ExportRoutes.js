const express = require("express");
const mongoose = require("mongoose");
const { Trip } = require("../models/Trip");
const { TripItem } = require("../models/TripItem");
const authMiddleware = require("../middleware/authMiddleware");
const { prepareItineraryData } = require("../services/itineraryService");
const { generateItineraryPDF } = require("../services/pdfService");

const exportRouter = express.Router();

// POST /trips/:tripId/export/itinerary
// Generates a PDF itinerary for a trip owned by the authenticated user.
exportRouter.post("/:tripId/export/itinerary", authMiddleware, async (request, response) => {
    try {
        const { tripId } = request.params;

        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            return response.status(404).json({
                message: "Trip not found."
            });
        }

        const foundTrip = await Trip.findOne({
            _id: tripId,
            userId: request.user.userId
        });

        if (!foundTrip) {
            return response.status(404).json({
                message: "Trip not found."
            });
        }

        const tripItems = await TripItem.find({
            tripId: foundTrip._id
        }).sort({ startDateTime: 1 });

        const preparedData = prepareItineraryData({
            trip: foundTrip,
            tripItems
        });

        response.setHeader("Content-Type", "application/pdf");
        response.setHeader(
            "Content-Disposition",
            `attachment; filename="${foundTrip.title} itinerary.pdf"`
        );

        generateItineraryPDF(preparedData, response);
    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while generating the itinerary PDF."
        });
    }
});

module.exports = exportRouter;