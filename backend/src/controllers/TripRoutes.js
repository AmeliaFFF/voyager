const express = require("express");
const mongoose = require("mongoose");
const { Trip } = require("../models/Trip");
const { TripItem } = require("../models/TripItem");
const authMiddleware = require("../middleware/authMiddleware");
const { tripStatusValues } = require("../utils/enumValues");
const { isValidEnumValue } = require("../utils/enumValidation");

const tripRouter = express.Router();

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
        // Status is optional because the Trip model defaults it to "planned".
        if (!title || !destination || !startDate || !endDate) {
            return response.status(400).json({
                message: "Title, destination, startDate, and endDate are required."
            });
        }

        const trimmedTitle = title.trim();
        const trimmedDestination = destination.trim();

        // Validate trimmed required string fields.
        if (!trimmedTitle || !trimmedDestination) {
            return response.status(400).json({
                message: "Title and destination cannot be empty."
            });
        }

        // Validate status if it was provided.
        // If status is omitted, the Trip model will use the default value of "planned".
        if (status !== undefined && !isValidEnumValue(status, tripStatusValues)) {
            return response.status(400).json({
                message: `Invalid trip status. Status must be one of: ${tripStatusValues.join(", ")}.`
            });
        }

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        // Validate trip date order.
        if (parsedStartDate > parsedEndDate) {
            return response.status(400).json({
                message: "startDate must be before or equal to endDate."
            });
        }

        // Create the new trip for the authenticated user.
        // The userId is taken from the JWT (request.user), not the request body, to prevent users from creating trips for other users.
        const newTripData = {
            userId: request.user.userId,
            title: trimmedTitle,
            destination: trimmedDestination,
            startDate,
            endDate,
            notes,
            budget,
            currencyCode
        };

        if (status !== undefined) {
            newTripData.status = status;
        }

        const newTrip = await Trip.create(newTripData);

        return response.status(201).json({
            message: "Trip created successfully.",
            data: formatTripResponse(newTrip)
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
            if (!isValidEnumValue(status, tripStatusValues)) {
                return response.status(400).json({
                    message: `Invalid status filter. Status must be one of: ${tripStatusValues.join(", ")}.`
                });
            }

            tripQuery.status = status;
        }

        // Sort trips by start date in ascending order for a consistent timeline view.
        const trips = await Trip.find(tripQuery).sort({ startDate: 1 });

        return response.status(200).json({
            message: "Trips retrieved successfully.",
            data: {
                // Map each trip document into the API response shape.
                trips: trips.map(formatTripResponse)
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
            data: formatTripResponse(foundTrip)
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

        const nextStartDate = startDate !== undefined ? new Date(startDate) : foundTrip.startDate;
        const nextEndDate = endDate !== undefined ? new Date(endDate) : foundTrip.endDate;

        // Validate trip date order after applying any incoming updates.
        if (nextStartDate > nextEndDate) {
            return response.status(400).json({
                message: "startDate must be before or equal to endDate."
            });
        }

        // Only update fields that were actually provided in the request body.
        if (title !== undefined) {
            const trimmedTitle = title.trim();

            if (!trimmedTitle) {
                return response.status(400).json({
                    message: "Title cannot be empty."
                });
            }

            foundTrip.title = trimmedTitle;
        }

        if (status !== undefined) {
            if (!isValidEnumValue(status, tripStatusValues)) {
                return response.status(400).json({
                    message: `Invalid trip status. Status must be one of: ${tripStatusValues.join(", ")}.`
                });
            }

            foundTrip.status = status;
        }

        if (destination !== undefined) {
            const trimmedDestination = destination.trim();

            if (!trimmedDestination) {
                return response.status(400).json({
                    message: "Destination cannot be empty."
                });
            }

            foundTrip.destination = trimmedDestination;
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
            data: formatTripResponse(foundTrip)
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

        // Delete all TripItems that belong to this trip first, then delete the trip itself to avoid orphaned TripItems.
        await TripItem.deleteMany({ tripId: foundTrip._id });
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