const express = require("express");
const mongoose = require("mongoose");
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
        // The userId is taken from the JWT (request.user), not the request body, to prevent users from creating trips for other users.
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

        // Optionally filter by trip status if a query parameter is provided.
        if (status) {
            tripQuery.status = status;
        }

        // Sort trips by start date in ascending order for a consistent timeline view.
        const trips = await Trip.find(tripQuery).sort({ startDate: 1 });

        return response.status(200).json({
            message: "Trips retrieved successfully.",
            data: {
                // Mapping to remove internal fields (e.g., _id, __v) and ensures consistent naming (id instead of _id) in the API response.
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

// GET /trips/:tripId
// Returns one specific trip for the authenticated user.
tripRouter.get("/:tripId", authMiddleware, async (request, response) => {
    try {
        const { tripId } = request.params;

        // Validate trip ID format before querying the database.
        // This prevents Mongoose CastErrors and ensures invalid IDs return a 404 instead of a 500.
        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            return response.status(404).json({
                message: "Trip not found."
            });
        }

        // Find the trip only if it belongs to the authenticated user (prevents users from accessing other users' trips).
        const foundTrip = await Trip.findOne({
            _id: tripId,
            userId: request.user.userId
        });

        if (!foundTrip) {
            return response.status(404).json({
                message: "Trip not found."
            });
        }

        return response.status(200).json({
            message: "Trip retrieved successfully.",
            data: {
                id: foundTrip._id,
                userId: foundTrip.userId,
                title: foundTrip.title,
                status: foundTrip.status,
                destination: foundTrip.destination,
                startDate: foundTrip.startDate,
                endDate: foundTrip.endDate,
                notes: foundTrip.notes,
                budget: foundTrip.budget,
                currencyCode: foundTrip.currencyCode,
                createdAt: foundTrip.createdAt,
                updatedAt: foundTrip.updatedAt
            }
        });
    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while retrieving the trip."
        });
    }
});

// PATCH /trips/:tripId
// Updates one specific trip for the authenticated user.
tripRouter.patch("/:tripId", authMiddleware, async (request, response) => {
    try {
        const { tripId } = request.params;

        // Validate trip ID format before querying the database.
        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            return response.status(404).json({
                message: "Trip not found."
            });
        }

        // Find the trip only if it belongs to the authenticated user.
        const foundTrip = await Trip.findOne({
            _id: tripId,
            userId: request.user.userId
        });

        if (!foundTrip) {
            return response.status(404).json({
                message: "Trip not found."
            });
        }

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

        // Only update fields that were actually provided in the request body.
        if (title !== undefined) {
            foundTrip.title = title.trim();
        }

        if (status !== undefined) {
            foundTrip.status = status;
        }

        if (destination !== undefined) {
            foundTrip.destination = destination.trim();
        }

        if (startDate !== undefined) {
            foundTrip.startDate = startDate;
        }

        if (endDate !== undefined) {
            foundTrip.endDate = endDate;
        }

        if (notes !== undefined) {
            foundTrip.notes = notes;
        }

        if (budget !== undefined) {
            foundTrip.budget = budget;
        }

        if (currencyCode !== undefined) {
            foundTrip.currencyCode = currencyCode;
        }

        await foundTrip.save();

        return response.status(200).json({
            message: "Trip updated successfully.",
            data: {
                id: foundTrip._id,
                userId: foundTrip.userId,
                title: foundTrip.title,
                status: foundTrip.status,
                destination: foundTrip.destination,
                startDate: foundTrip.startDate,
                endDate: foundTrip.endDate,
                notes: foundTrip.notes,
                budget: foundTrip.budget,
                currencyCode: foundTrip.currencyCode,
                createdAt: foundTrip.createdAt,
                updatedAt: foundTrip.updatedAt
            }
        });
    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while updating the trip."
        });
    }
});

// DELETE /trips/:tripId
// Deletes one specific trip for the authenticated user.
tripRouter.delete("/:tripId", authMiddleware, async (request, response) => {
    try {
        const { tripId } = request.params;

        // Validate trip ID format before querying the database.
        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            return response.status(404).json({
                message: "Trip not found."
            });
        }

        // Find the trip only if it belongs to the authenticated user.
        const foundTrip = await Trip.findOne({
            _id: tripId,
            userId: request.user.userId
        });

        if (!foundTrip) {
            return response.status(404).json({
                message: "Trip not found."
            });
        }

        await foundTrip.deleteOne();

        return response.status(200).json({
            message: "Trip deleted successfully."
        });
    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while deleting the trip."
        });
    }
});

module.exports = tripRouter;