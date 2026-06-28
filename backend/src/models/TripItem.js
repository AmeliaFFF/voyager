const mongoose = require("mongoose");
const {
    tripItemTypeValues,
    tripItemStatusValues
} = require("../utils/enumValues");

const tripItemSchema = new mongoose.Schema(
    {
        tripId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Trip"
        },
        type: {
            type: String,
            required: true,
            enum: tripItemTypeValues
        },
        status: {
            type: String,
            required: true,
            enum: tripItemStatusValues,
            default: "planned"
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: String,
            required: false,
            trim: true
        },
        startDateTime: {
            type: String,
            required: true
        },
        endDateTime: {
            type: String,
            required: false
        },
        provider: {
            type: String,
            required: false,
            trim: true
        },
        bookingReference: {
            type: String,
            required: false,
            trim: true
        },
        cost: {
            type: Number,
            required: false,
            min: 0
        },
        currencyCode: {
            type: String,
            required: false,
            trim: true,
            uppercase: true,
            minlength: 3,
            maxlength: 3
        },
        notes: {
            type: String,
            required: false,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const TripItem = mongoose.model("TripItem", tripItemSchema);

module.exports = {
    TripItem
};
