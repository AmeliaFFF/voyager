const express = require("express");
const mongoose = require("mongoose");
const { Trip } = require("../models/Trip");
const { TripItem } = require("../models/TripItem");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const adminRouter = express.Router();

// Formats a Trip document into a clean API response shape.
function formatTripResponse(trip) {
    return {
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
    };
}

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

// GET /admin/trips
// Returns all trips across all users.
// This is an admin-only support/moderation view.
adminRouter.get("/trips", authMiddleware, adminMiddleware, async (request, response) => {
    try {
        const trips = await Trip.find().sort({ startDate: 1 });

        return response.status(200).json({
            message: "All trips retrieved successfully.",
            data: {
                trips: trips.map(formatTripResponse)
            }
        });
    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while retrieving all trips."
        });
    }
});

// GET /admin/trips/:tripId
// Returns one trip across any user account.
adminRouter.get("/trips/:tripId", authMiddleware, adminMiddleware, async (request, response) => {
    try {
        const { tripId } = request.params;

        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            return response.status(404).json({
                message: "Trip not found."
            });
        }

        const foundTrip = await Trip.findById(tripId);

        if (!foundTrip) {
            return response.status(404).json({
                message: "Trip not found."
            });
        }

        return response.status(200).json({
            message: "Trip retrieved successfully.",
            data: formatTripResponse(foundTrip)
        });
    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while retrieving the trip."
        });
    }
});

// DELETE /admin/trips/:tripId
// Deletes any trip across any user account.
// Associated TripItems are also deleted to avoid orphaned TripItems.
adminRouter.delete("/trips/:tripId", authMiddleware, adminMiddleware, async (request, response) => {
    try {
        const { tripId } = request.params;

        if (!mongoose.Types.ObjectId.isValid(tripId)) {
            return response.status(404).json({
                message: "Trip not found."
            });
        }

        const foundTrip = await Trip.findById(tripId);

        if (!foundTrip) {
            return response.status(404).json({
                message: "Trip not found."
            });
        }

        await TripItem.deleteMany({ tripId: foundTrip._id });
        await foundTrip.deleteOne();

        return response.status(200).json({
            message: "Trip deleted successfully by admin."
        });
    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while deleting the trip."
        });
    }
});

// GET /admin/trip-items
// Returns all trip items across all users.
adminRouter.get("/trip-items", authMiddleware, adminMiddleware, async (request, response) => {
    try {
        const tripItems = await TripItem.find().sort({ startDateTime: 1 });

        return response.status(200).json({
            message: "All trip items retrieved successfully.",
            data: {
                tripItems: tripItems.map(formatTripItemResponse)
            }
        });
    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while retrieving all trip items."
        });
    }
});

// GET /admin/trip-items/:tripItemId
// Returns one trip item across any user account.
adminRouter.get("/trip-items/:tripItemId", authMiddleware, adminMiddleware, async (request, response) => {
    try {
        const { tripItemId } = request.params;

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

// DELETE /admin/trip-items/:tripItemId
// Deletes any trip item across any user account.
adminRouter.delete("/trip-items/:tripItemId", authMiddleware, adminMiddleware, async (request, response) => {
    try {
        const { tripItemId } = request.params;

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

        await foundTripItem.deleteOne();

        return response.status(200).json({
            message: "Trip item deleted successfully by admin."
        });
    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while deleting the trip item."
        });
    }
});

module.exports = adminRouter;