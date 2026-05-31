const express = require("express");
const mongoose = require("mongoose");
const { Trip } = require("../models/Trip");
const { TripItem } = require("../models/TripItem");
const authMiddleware = require("../middleware/authMiddleware");
const { tripItemTypeValues, tripItemStatusValues } = require("../utils/enumValues");
const { isValidEnumValue } = require("../utils/enumValidation");

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
        // Status is optional because the TripItem model defaults it to "planned".
        if (!type || !title || !startDateTime) {
            return response.status(400).json({
                message: "Type, title, and startDateTime are required."
            });
        }

        const trimmedTitle = title.trim();

        // Validate trimmed required string fields.
        if (!trimmedTitle) {
            return response.status(400).json({
                message: "Title cannot be empty."
            });
        }

        // Validate TripItem type.
        if (!isValidEnumValue(type, tripItemTypeValues)) {
            return response.status(400).json({
                message: `Invalid trip item type. Type must be one of: ${tripItemTypeValues.join(", ")}.`
            });
        }

        // Validate status if it was provided.
        // If status is omitted, the TripItem model will use the default value of "planned".
        if (status !== undefined && !isValidEnumValue(status, tripItemStatusValues)) {
            return response.status(400).json({
                message: `Invalid trip item status. Status must be one of: ${tripItemStatusValues.join(", ")}.`
            });
        }

        if (endDateTime) {
            const parsedStart = new Date(startDateTime);
            const parsedEnd = new Date(endDateTime);

            if (parsedStart > parsedEnd) {
                return response.status(400).json({
                    message: "startDateTime must be before or equal to endDateTime."
                });
            }
        }

        // Create the new TripItem for the authenticated user's trip.
        const newTripItemData = {
            tripId: foundTrip._id,
            type,
            title: trimmedTitle,
            location,
            startDateTime,
            endDateTime,
            provider,
            bookingReference,
            cost,
            currencyCode,
            notes
        };

        if (status !== undefined) {
            newTripItemData.status = status;
        }

        const newTripItem = await TripItem.create(newTripItemData);

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
            if (!isValidEnumValue(type, tripItemTypeValues)) {
                return response.status(400).json({
                    message: `Invalid type filter. Type must be one of: ${tripItemTypeValues.join(", ")}.`
                });
            }

            tripItemQuery.type = type;
        }

        // Optionally filter by TripItem status.
        if (status) {
            if (!isValidEnumValue(status, tripItemStatusValues)) {
                return response.status(400).json({
                    message: `Invalid status filter. Status must be one of: ${tripItemStatusValues.join(", ")}.`
                });
            }

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

// PATCH /trip-items/:tripItemId
// Updates one specific TripItem for the authenticated user.
tripItemRouter.patch("/trip-items/:tripItemId", authMiddleware, async (request, response) => {
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

        const nextStartDateTime = startDateTime !== undefined ? new Date(startDateTime) : foundTripItem.startDateTime;
        const nextEndDateTime = endDateTime !== undefined ? new Date(endDateTime) : foundTripItem.endDateTime;

        if (nextEndDateTime && nextStartDateTime > nextEndDateTime) {
            return response.status(400).json({
                message: "startDateTime must be before or equal to endDateTime."
            });
        }

        // Only update fields that were actually provided in the request body.
        if (type !== undefined) {
            if (!isValidEnumValue(type, tripItemTypeValues)) {
                return response.status(400).json({
                    message: `Invalid trip item type. Type must be one of: ${tripItemTypeValues.join(", ")}.`
                });
            }

            foundTripItem.type = type;
        }

        if (status !== undefined) {
            if (!isValidEnumValue(status, tripItemStatusValues)) {
                return response.status(400).json({
                    message: `Invalid trip item status. Status must be one of: ${tripItemStatusValues.join(", ")}.`
                });
            }

            foundTripItem.status = status;
        }

        if (title !== undefined) {
            const trimmedTitle = title.trim();

            if (!trimmedTitle) {
                return response.status(400).json({
                    message: "Title cannot be empty."
                });
            }

            foundTripItem.title = trimmedTitle;
        }

        if (location !== undefined) {
            foundTripItem.location = location.trim();
        }

        if (startDateTime !== undefined) {
            foundTripItem.startDateTime = startDateTime;
        }

        if (endDateTime !== undefined) {
            foundTripItem.endDateTime = endDateTime;
        }

        if (provider !== undefined) {
            foundTripItem.provider = provider.trim();
        }

        if (bookingReference !== undefined) {
            foundTripItem.bookingReference = bookingReference.trim();
        }

        if (cost !== undefined) {
            foundTripItem.cost = cost;
        }

        if (currencyCode !== undefined) {
            foundTripItem.currencyCode = currencyCode;
        }

        if (notes !== undefined) {
            foundTripItem.notes = notes;
        }

        await foundTripItem.save();

        return response.status(200).json({
            message: "Trip item updated successfully.",
            data: formatTripItemResponse(foundTripItem)
        });
    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while updating the trip item."
        });
    }
});

// DELETE /trip-items/:tripItemId
// Deletes one specific TripItem for the authenticated user.
tripItemRouter.delete("/trip-items/:tripItemId", authMiddleware, async (request, response) => {
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

        await foundTripItem.deleteOne();

        return response.status(200).json({
            message: "Trip item deleted successfully."
        });
    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while deleting the trip item."
        });
    }
});

module.exports = tripItemRouter;