const express = require("express");
const mongoose = require("mongoose");
const { Trip } = require("../models/Trip");
const { TripItem } = require("../models/TripItem");
const authMiddleware = require("../middleware/authMiddleware");

const tripItemRouter = express.Router();

// Formats a TripItem document into a clean API response shape.
function formatTripItemResponse(tripItem) {
    return {
        id: tripItem._id,
        tripId: tripItem.tripId,
        type: tripItem.type,
        status: tripItem.status,
        title: tripItem.title,
        location: tripItem.location,
        startDateTime: tripItem.startDateTime,
        endDateTime: tripItem.endDateTime,
        provider: tripItem.provider,
        bookingReference: tripItem.bookingReference,
        cost: tripItem.cost,
        currencyCode: tripItem.currencyCode,
        notes: tripItem.notes,
        createdAt: tripItem.createdAt,
        updatedAt: tripItem.updatedAt
    };
}

// POST /trips/:tripId/items
// Creates a new TripItem inside a specific trip for the authenticated user.
tripItemRouter.post("/trips/:tripId/items", authMiddleware, async (request, response) => {
    try {
        const { tripId } = request.params;

        // Validate trip ID format before querying the database.
        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            return response.status(404).json({
                message: "Trip not found."
            });
        }

        // Confirm the trip exists and belongs to the authenticated user.
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
            type,
            status,
            title,
            location,
            startDateTime,
            endDateTime,
            provider,
            bookingReference,
            cost,
            currencyCode,
            notes
        } = request.body || {};

        // Validate required fields.
        if (!type || !status || !title || !startDateTime) {
            return response.status(400).json({
                message: "Type, status, title, and startDateTime are required."
            });
        }

        // Create the new TripItem for the authenticated user's trip.
        const newTripItem = await TripItem.create({
            tripId: foundTrip._id,
            type,
            status,
            title: title.trim(),
            location,
            startDateTime,
            endDateTime,
            provider,
            bookingReference,
            cost,
            currencyCode,
            notes
        });

        return response.status(201).json({
            message: "Trip item created successfully.",
            data: formatTripItemResponse(newTripItem)
        });
    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while creating the trip item."
        });
    }
});

// GET /trips/:tripId/items
// Returns all TripItems for a specific trip owned by the authenticated user.
tripItemRouter.get("/trips/:tripId/items", authMiddleware, async (request, response) => {
    try {
        const { tripId } = request.params;
        const { type, status } = request.query;

        // Validate trip ID format before querying the database.
        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            return response.status(404).json({
                message: "Trip not found."
            });
        }

        // Confirm the trip exists and belongs to the authenticated user.
        const foundTrip = await Trip.findOne({
            _id: tripId,
            userId: request.user.userId
        });

        if (!foundTrip) {
            return response.status(404).json({
                message: "Trip not found."
            });
        }

        // Build the query so only TripItems for this trip are returned.
        const tripItemQuery = {
            tripId: foundTrip._id
        };

        // Optionally filter by TripItem type.
        if (type) {
            tripItemQuery.type = type;
        }

        // Optionally filter by TripItem status.
        if (status) {
            tripItemQuery.status = status;
        }

        // Sort TripItems chronologically by start date/time.
        const tripItems = await TripItem.find(tripItemQuery).sort({ startDateTime: 1 });

        return response.status(200).json({
            message: "Trip items retrieved successfully.",
            data: {
                tripItems: tripItems.map(formatTripItemResponse)
            }
        });
    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while retrieving trip items."
        });
    }
});

// GET /trip-items/:tripItemId
// Returns one specific TripItem for the authenticated user.
tripItemRouter.get("/trip-items/:tripItemId", authMiddleware, async (request, response) => {
    try {
        const { tripItemId } = request.params;

        // Validate TripItem ID format before querying the database.
        if (!mongoose.Types.ObjectId.isValid(tripItemId)) {
            return response.status(404).json({
                message: "Trip item not found."
            });
        }

        const foundTripItem = await TripItem.findById(tripItemId);

        if (!foundTripItem) {
            return response.status(404).json({
                message: "Trip item not found."
            });
        }

        // Confirm the parent trip belongs to the authenticated user.
        const foundTrip = await Trip.findOne({
            _id: foundTripItem.tripId,
            userId: request.user.userId
        });

        if (!foundTrip) {
            return response.status(404).json({
                message: "Trip item not found."
            });
        }

        return response.status(200).json({
            message: "Trip item retrieved successfully.",
            data: formatTripItemResponse(foundTripItem)
        });
    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while retrieving the trip item."
        });
    }
});

module.exports = tripItemRouter;