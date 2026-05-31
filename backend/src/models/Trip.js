const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            required: true,
            enum: ["planned", "booked", "completed", "cancelled"],
            default: "planned"
        },
        destination: {
            type: String,
            required: true,
            trim: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        notes: {
            type: String,
            required: false,
            trim: true
        },
        budget: {
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
        }
    },
    {
        timestamps: true
    }
);

const Trip = mongoose.model("Trip", tripSchema);

module.exports = {
    Trip
};