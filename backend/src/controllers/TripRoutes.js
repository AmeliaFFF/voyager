const express = require("express");
const { Trip } = require("../models/Trip");
const authMiddleware = require("../middleware/authMiddleware");

const tripRouter = express.Router();

// POST /trips
// Creates a new trip for the authenticated user.
tripRouter.post("/", authMiddleware, async (request, response) => {
    try {
        const {
            title,
            status,
            destination,
            startDate,
            endDate,
            notes,
            budget,
            currencyCode
        } = request.body || {};

        // Validate required fields.
        if (!title || !status || !destination || !startDate || !endDate) {
            return response.status(400).json({
                message: "Title, status, destination, startDate, and endDate are required."
            });
        }

        // Create the new trip for the authenticated user.
        const newTrip = await Trip.create({
            userId: request.user.userId,
            title: title.trim(),
            status,
            destination: destination.trim(),
            startDate,
            endDate,
            notes,
            budget,
            currencyCode
        });

        return response.status(201).json({
            message: "Trip created successfully.",
            data: {
                id: newTrip._id,
                userId: newTrip.userId,
                title: newTrip.title,
                status: newTrip.status,
                destination: newTrip.destination,
                startDate: newTrip.startDate,
                endDate: newTrip.endDate,
                notes: newTrip.notes,
                budget: newTrip.budget,
                currencyCode: newTrip.currencyCode,
                createdAt: newTrip.createdAt,
                updatedAt: newTrip.updatedAt
            }
        });
    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while creating the trip."
        });
    }
});

module.exports = tripRouter;