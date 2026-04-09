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

// GET /trips
// Returns all trips for the authenticated user.
tripRouter.get("/", authMiddleware, async (request, response) => {
    try {
        const { status } = request.query;

        // Build the query so only the authenticated user's trips are returned.
        const tripQuery = {
            userId: request.user.userId
        };

        // Optionally filter by trip status.
        if (status) {
            tripQuery.status = status;
        }

        const trips = await Trip.find(tripQuery).sort({ startDate: 1 });

        return response.status(200).json({
            message: "Trips retrieved successfully.",
            data: {
                trips: trips.map((trip) => ({
                    id: trip._id,
                    userId: trip.userId,
                    title: trip.title,
                    status: trip.status,
                    destination: trip.destination,
                    startDate: trip.startDate,
                    endDate: trip.endDate,
                    notes: trip.notes,
                    budget: trip.budget,
                    currencyCode: trip.currencyCode,
                    createdAt: trip.createdAt,
                    updatedAt: trip.updatedAt
                }))
            }
        });
    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while retrieving trips."
        });
    }
});

module.exports = tripRouter;