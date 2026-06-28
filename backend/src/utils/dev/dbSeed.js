const { loadEnvFile } = require("node:process");
const { User } = require("../../models/User");
const { Trip } = require("../../models/Trip");
const { TripItem } = require("../../models/TripItem");
const { dbConnect, dbDisconnect } = require("../database");

loadEnvFile();

async function dbSeed() {
    console.log("Seeding database...");

    const usersToSeed = [
        {
            name: "Seed Regular User",
            email: "seed.regular@example.com",
            isAdmin: false,
            passwordHash: "Password123"
        },
        {
            name: "Seed Admin User",
            email: "seed.admin@example.com",
            isAdmin: true,
            passwordHash: "Password123"
        }
    ];

    console.log("Seeding users...");

    // Users are created one by one so the User model pre-save hook hashes each password.
    for await (const userData of usersToSeed) {
        await User.create(userData);
    }

    const regularUser = await User.findOne({
        email: "seed.regular@example.com"
    });

    const adminUser = await User.findOne({
        email: "seed.admin@example.com"
    });

    const tripsToSeed = [
        {
            userId: regularUser._id,
            title: "Japan 2026",
            status: "planned",
            destination: "Japan",
            startDate: "2026-09-01",
            endDate: "2026-09-21",
            notes: "Seed trip for testing planned status.",
            budget: 5000,
            currencyCode: "AUD"
        },
        {
            userId: regularUser._id,
            title: "New Zealand Weekend",
            status: "booked",
            destination: "Queenstown",
            startDate: "2026-05-15",
            endDate: "2026-05-18",
            notes: "Seed trip for testing booked status.",
            budget: 1800,
            currencyCode: "AUD"
        },
        {
            userId: adminUser._id,
            title: "Completed Admin Demo Trip",
            status: "completed",
            destination: "Melbourne",
            startDate: "2025-11-10",
            endDate: "2025-11-14",
            notes: "Seed trip owned by admin user.",
            budget: 1200,
            currencyCode: "AUD"
        },
        {
            userId: regularUser._id,
            title: "Cancelled Bali Trip",
            status: "cancelled",
            destination: "Bali",
            startDate: "2026-03-01",
            endDate: "2026-03-08",
            notes: "Seed trip for testing cancelled status.",
            budget: 2200,
            currencyCode: "AUD"
        }
    ];

    console.log("Seeding trips...");

    const createdTrips = await Trip.insertMany(tripsToSeed);

    const japanTrip = createdTrips.find((trip) => {
        return trip.title === "Japan 2026";
    });

    const queenstownTrip = createdTrips.find((trip) => {
        return trip.title === "New Zealand Weekend";
    });

    const adminTrip = createdTrips.find((trip) => {
        return trip.title === "Completed Admin Demo Trip";
    });

    const cancelledTrip = createdTrips.find((trip) => {
        return trip.title === "Cancelled Bali Trip";
    });

    const tripItemsToSeed = [
        {
            tripId: japanTrip._id,
            type: "flight",
            status: "booked",
            title: "Flight to Tokyo",
            location: "Brisbane Airport",
            startDateTime: "2026-09-01T10:00",
            endDateTime: "2026-09-01T19:30",
            provider: "Seed Airline",
            bookingReference: "JPN123",
            cost: 1500,
            currencyCode: "AUD",
            notes: "Seed flight item."
        },
        {
            tripId: japanTrip._id,
            type: "accommodation",
            status: "planned",
            title: "Tokyo Hotel",
            location: "Tokyo",
            startDateTime: "2026-09-01T15:00",
            endDateTime: "2026-09-07T10:00",
            provider: "Seed Hotel",
            bookingReference: "HOTEL123",
            cost: 900,
            currencyCode: "AUD",
            notes: "Seed accommodation item."
        },
        {
            tripId: queenstownTrip._id,
            type: "activity",
            status: "booked",
            title: "Lake cruise",
            location: "Queenstown",
            startDateTime: "2026-05-16T12:00",
            endDateTime: "2026-05-16T14:00",
            provider: "Seed Tours",
            bookingReference: "CRUISE123",
            cost: 120,
            currencyCode: "AUD",
            notes: "Seed activity item."
        },
        {
            tripId: adminTrip._id,
            type: "transport",
            status: "completed",
            title: "Airport transfer",
            location: "Melbourne",
            startDateTime: "2025-11-10T13:00",
            endDateTime: "2025-11-10T14:00",
            provider: "Seed Transfers",
            bookingReference: "TRANSFER123",
            cost: 80,
            currencyCode: "AUD",
            notes: "Seed completed transport item."
        },
        {
            tripId: cancelledTrip._id,
            type: "tour",
            status: "cancelled",
            title: "Cancelled temple tour",
            location: "Bali",
            startDateTime: "2026-03-03T11:00",
            endDateTime: "2026-03-03T15:00",
            provider: "Seed Tours",
            bookingReference: "CANCEL123",
            cost: 200,
            currencyCode: "AUD",
            notes: "Seed cancelled trip item."
        }
    ];

    console.log("Seeding trip items...");

    await TripItem.insertMany(tripItemsToSeed);

    console.log("Database seeded successfully.");
}

dbConnect()
    .then(async () => {
        await dbSeed();
        await dbDisconnect();
    })
    .catch(async (error) => {
        console.error("Database seed failed.");
        console.error(error);

        await dbDisconnect();
    });
