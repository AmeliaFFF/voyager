const mongoose = require("mongoose");

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
            enum: ["flight", "transport", "accommodation", "tour", "cruise", "activity", "other"]
        },
        status: {
            type: String,
            required: true,
            enum: ["planned", "booked", "completed"]
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
            type: Date,
            required: true
        },
        endDateTime: {
            type: Date,
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