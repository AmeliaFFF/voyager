const { loadEnvFile } = require("node:process");
const { User } = require("../../models/User");
const { Trip } = require("../../models/Trip");
const { TripItem } = require("../../models/TripItem");
const { dbConnect, dbDisconnect } = require("../database");

loadEnvFile();

function findTripByTitle(trips, title) {
    return trips.find((trip) => {
        return trip.title === title;
    });
}

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
            title: "Japan Spring 2026",
            status: "planned",
            destination: "Japan",
            startDate: "2026-02-26",
            endDate: "2026-04-18",
            notes: "Demo long itinerary for testing multi-day trip planning, filters and PDF export.",
            budget: 8500,
            currencyCode: "AUD"
        },
        {
            userId: regularUser._id,
            title: "New Zealand Winter Weekend",
            status: "booked",
            destination: "Queenstown, New Zealand",
            startDate: "2026-07-10",
            endDate: "2026-07-14",
            notes: "Demo booked trip with flights, accommodation, activities and transport.",
            budget: 2600,
            currencyCode: "AUD"
        },
        {
            userId: regularUser._id,
            title: "Sydney Food Weekend",
            status: "completed",
            destination: "Sydney, Australia",
            startDate: "2025-11-07",
            endDate: "2025-11-10",
            notes: "Demo completed trip for testing completed status display.",
            budget: 1200,
            currencyCode: "AUD"
        },
        {
            userId: regularUser._id,
            title: "Bali Beach Break",
            status: "cancelled",
            destination: "Bali, Indonesia",
            startDate: "2026-03-01",
            endDate: "2026-03-08",
            notes: "Demo cancelled trip for testing cancelled trip and itinerary item states.",
            budget: 2200,
            currencyCode: "AUD"
        },
        {
            userId: regularUser._id,
            title: "Tasmania Road Trip",
            status: "planned",
            destination: "Tasmania, Australia",
            startDate: "2026-10-03",
            endDate: "2026-10-12",
            notes: "Demo planned trip with no itinerary items yet. Useful for testing empty states.",
            budget: 1800,
            currencyCode: "AUD"
        },
        {
            userId: adminUser._id,
            title: "Admin Melbourne Conference",
            status: "completed",
            destination: "Melbourne, Australia",
            startDate: "2025-09-15",
            endDate: "2025-09-18",
            notes: "Demo trip owned by the admin user for testing admin-only views.",
            budget: 1600,
            currencyCode: "AUD"
        }
    ];

    console.log("Seeding trips...");

    const createdTrips = await Trip.insertMany(tripsToSeed);

    const japanTrip = findTripByTitle(createdTrips, "Japan Spring 2026");
    const queenstownTrip = findTripByTitle(
        createdTrips,
        "New Zealand Winter Weekend"
    );
    const sydneyTrip = findTripByTitle(createdTrips, "Sydney Food Weekend");
    const baliTrip = findTripByTitle(createdTrips, "Bali Beach Break");
    const adminTrip = findTripByTitle(
        createdTrips,
        "Admin Melbourne Conference"
    );

    const tripItemsToSeed = [
        {
            tripId: japanTrip._id,
            type: "flight",
            status: "booked",
            title: "Fly from Brisbane to Tokyo",
            location: "Brisbane Airport",
            startDateTime: "2026-02-26T09:45",
            endDateTime: "2026-02-26T18:30",
            provider: "Voyager Airways",
            bookingReference: "DEMO-JP-FLT1",
            cost: 1450,
            currencyCode: "AUD",
            notes: "Demo international flight. Local datetime strings are intentionally stored without a timezone suffix."
        },
        {
            tripId: japanTrip._id,
            type: "transport",
            status: "planned",
            title: "Train from airport to Tokyo hotel",
            location: "Tokyo",
            startDateTime: "2026-02-26T19:30",
            endDateTime: "2026-02-26T20:45",
            provider: "Tokyo Rail Demo",
            bookingReference: "DEMO-JP-RAIL1",
            cost: 45,
            currencyCode: "AUD",
            notes: "Planned transport item for testing type and status filters."
        },
        {
            tripId: japanTrip._id,
            type: "accommodation",
            status: "booked",
            title: "Tokyo hotel stay",
            location: "Shinjuku, Tokyo",
            startDateTime: "2026-02-26T15:00",
            endDateTime: "2026-03-05T10:00",
            provider: "Shinjuku Garden Hotel",
            bookingReference: "DEMO-JP-HOTEL1",
            cost: 1350,
            currencyCode: "AUD",
            notes: "Accommodation item spanning multiple days."
        },
        {
            tripId: japanTrip._id,
            type: "activity",
            status: "planned",
            title: "Digital art museum visit",
            location: "Tokyo",
            startDateTime: "2026-02-28T11:00",
            endDateTime: "2026-02-28T13:30",
            provider: "Tokyo Digital Arts Demo",
            bookingReference: "DEMO-JP-ACT1",
            cost: 60,
            currencyCode: "AUD",
            notes: "Planned activity for testing itinerary item cards."
        },
        {
            tripId: japanTrip._id,
            type: "tour",
            status: "booked",
            title: "Fukushima guided day tour",
            location: "Fukushima",
            startDateTime: "2026-03-03T08:00",
            endDateTime: "2026-03-03T18:30",
            provider: "North Japan Guided Tours",
            bookingReference: "DEMO-JP-TOUR1",
            cost: 320,
            currencyCode: "AUD",
            notes: "Booked day tour for testing longer notes and mixed item types."
        },
        {
            tripId: japanTrip._id,
            type: "transport",
            status: "planned",
            title: "Shinkansen from Tokyo to Kyoto",
            location: "Tokyo Station",
            startDateTime: "2026-03-05T10:30",
            endDateTime: "2026-03-05T13:00",
            provider: "Japan Rail Demo",
            bookingReference: "DEMO-JP-RAIL2",
            cost: 180,
            currencyCode: "AUD",
            notes: "Planned intercity transport."
        },
        {
            tripId: japanTrip._id,
            type: "accommodation",
            status: "planned",
            title: "Kyoto machiya stay",
            location: "Gion, Kyoto",
            startDateTime: "2026-03-05T15:00",
            endDateTime: "2026-03-12T10:00",
            provider: "Kyoto Heritage Stays",
            bookingReference: "DEMO-JP-HOTEL2",
            cost: 1250,
            currencyCode: "AUD",
            notes: "Planned accommodation for testing planned status styling."
        },
        {
            tripId: japanTrip._id,
            type: "activity",
            status: "cancelled",
            title: "Cancelled cooking class",
            location: "Kyoto",
            startDateTime: "2026-03-07T17:00",
            endDateTime: "2026-03-07T20:00",
            provider: "Kyoto Kitchen Demo",
            bookingReference: "DEMO-JP-CANCEL1",
            cost: 110,
            currencyCode: "AUD",
            notes: "Cancelled item inside an active trip for testing item-level cancelled status."
        },
        {
            tripId: japanTrip._id,
            type: "tour",
            status: "planned",
            title: "Hiroshima history day trip",
            location: "Hiroshima",
            startDateTime: "2026-03-10T08:15",
            endDateTime: "2026-03-10T19:00",
            provider: "Hiroshima Walking Tours",
            bookingReference: "DEMO-JP-TOUR2",
            cost: 210,
            currencyCode: "AUD",
            notes: "Planned tour for testing another date group."
        },
        {
            tripId: japanTrip._id,
            type: "flight",
            status: "planned",
            title: "Fly from Osaka to Okinawa",
            location: "Kansai Airport",
            startDateTime: "2026-03-13T12:20",
            endDateTime: "2026-03-13T14:35",
            provider: "Island Hopper Demo",
            bookingReference: "DEMO-JP-FLT2",
            cost: 260,
            currencyCode: "AUD",
            notes: "Domestic flight for testing multiple flight items."
        },
        {
            tripId: japanTrip._id,
            type: "cruise",
            status: "planned",
            title: "Okinawa sunset cruise",
            location: "Naha, Okinawa",
            startDateTime: "2026-03-15T17:00",
            endDateTime: "2026-03-15T19:30",
            provider: "Okinawa Coastal Cruises",
            bookingReference: "DEMO-JP-CRUISE1",
            cost: 95,
            currencyCode: "AUD",
            notes: "Cruise item for testing cruise-specific departure and arrival labels."
        },
        {
            tripId: japanTrip._id,
            type: "other",
            status: "planned",
            title: "Laundry and rest evening",
            location: "Naha, Okinawa",
            startDateTime: "2026-03-16T18:00",
            endDateTime: "2026-03-16T20:00",
            provider: "Self-guided",
            bookingReference: "DEMO-JP-OTHER1",
            cost: 15,
            currencyCode: "AUD",
            notes: "Other item type for testing the full type filter list."
        },
        {
            tripId: japanTrip._id,
            type: "flight",
            status: "planned",
            title: "Fly from Sapporo to Tokyo",
            location: "New Chitose Airport",
            startDateTime: "2026-04-16T13:10",
            endDateTime: "2026-04-16T15:00",
            provider: "Northern Skies Demo",
            bookingReference: "DEMO-JP-FLT3",
            cost: 280,
            currencyCode: "AUD",
            notes: "Late-trip flight to test sorting across a longer itinerary."
        },
        {
            tripId: japanTrip._id,
            type: "flight",
            status: "booked",
            title: "Fly from Tokyo to Brisbane",
            location: "Haneda Airport",
            startDateTime: "2026-04-18T21:30",
            endDateTime: "2026-04-19T07:20",
            provider: "Voyager Airways",
            bookingReference: "DEMO-JP-FLT4",
            cost: 1450,
            currencyCode: "AUD",
            notes: "Return flight with an end time on the following date."
        },
        {
            tripId: queenstownTrip._id,
            type: "flight",
            status: "booked",
            title: "Fly from Brisbane to Queenstown",
            location: "Brisbane Airport",
            startDateTime: "2026-07-10T08:30",
            endDateTime: "2026-07-10T14:10",
            provider: "Southern Cross Air",
            bookingReference: "DEMO-NZ-FLT1",
            cost: 720,
            currencyCode: "AUD",
            notes: "Booked flight for the New Zealand demo trip."
        },
        {
            tripId: queenstownTrip._id,
            type: "accommodation",
            status: "booked",
            title: "Lakeview apartment stay",
            location: "Queenstown",
            startDateTime: "2026-07-10T15:00",
            endDateTime: "2026-07-14T10:00",
            provider: "Queenstown Lakeview Apartments",
            bookingReference: "DEMO-NZ-HOTEL1",
            cost: 980,
            currencyCode: "AUD",
            notes: "Booked accommodation for testing booked trip details."
        },
        {
            tripId: queenstownTrip._id,
            type: "activity",
            status: "booked",
            title: "Gondola and luge afternoon",
            location: "Queenstown",
            startDateTime: "2026-07-11T13:00",
            endDateTime: "2026-07-11T16:00",
            provider: "Queenstown Adventure Demo",
            bookingReference: "DEMO-NZ-ACT1",
            cost: 150,
            currencyCode: "AUD",
            notes: "Booked activity item."
        },
        {
            tripId: queenstownTrip._id,
            type: "cruise",
            status: "booked",
            title: "Lake Wakatipu scenic cruise",
            location: "Lake Wakatipu",
            startDateTime: "2026-07-12T10:30",
            endDateTime: "2026-07-12T12:30",
            provider: "Wakatipu Scenic Cruises",
            bookingReference: "DEMO-NZ-CRUISE1",
            cost: 120,
            currencyCode: "AUD",
            notes: "Booked cruise item."
        },
        {
            tripId: queenstownTrip._id,
            type: "transport",
            status: "planned",
            title: "Airport transfer back to Queenstown Airport",
            location: "Queenstown",
            startDateTime: "2026-07-14T10:45",
            endDateTime: "2026-07-14T11:30",
            provider: "Queenstown Transfers Demo",
            bookingReference: "DEMO-NZ-TRANSFER1",
            cost: 65,
            currencyCode: "AUD",
            notes: "Planned transport item within a booked trip."
        },
        {
            tripId: sydneyTrip._id,
            type: "flight",
            status: "completed",
            title: "Fly from Brisbane to Sydney",
            location: "Brisbane Airport",
            startDateTime: "2025-11-07T07:00",
            endDateTime: "2025-11-07T08:35",
            provider: "Harbour Air Demo",
            bookingReference: "DEMO-SYD-FLT1",
            cost: 240,
            currencyCode: "AUD",
            notes: "Completed outbound flight."
        },
        {
            tripId: sydneyTrip._id,
            type: "accommodation",
            status: "completed",
            title: "Surry Hills boutique hotel",
            location: "Surry Hills, Sydney",
            startDateTime: "2025-11-07T14:00",
            endDateTime: "2025-11-10T10:00",
            provider: "Surry Hills Boutique Stay",
            bookingReference: "DEMO-SYD-HOTEL1",
            cost: 620,
            currencyCode: "AUD",
            notes: "Completed accommodation item."
        },
        {
            tripId: sydneyTrip._id,
            type: "activity",
            status: "completed",
            title: "Dinner booking in Newtown",
            location: "Newtown, Sydney",
            startDateTime: "2025-11-08T19:00",
            endDateTime: "2025-11-08T21:00",
            provider: "Newtown Dining Demo",
            bookingReference: "DEMO-SYD-FOOD1",
            cost: 120,
            currencyCode: "AUD",
            notes: "Completed activity item."
        },
        {
            tripId: baliTrip._id,
            type: "flight",
            status: "cancelled",
            title: "Cancelled flight to Denpasar",
            location: "Brisbane Airport",
            startDateTime: "2026-03-01T10:15",
            endDateTime: "2026-03-01T16:40",
            provider: "Island Demo Airways",
            bookingReference: "DEMO-BALI-FLT1",
            cost: 620,
            currencyCode: "AUD",
            notes: "Cancelled flight item for testing cancelled status."
        },
        {
            tripId: baliTrip._id,
            type: "accommodation",
            status: "cancelled",
            title: "Cancelled Seminyak villa",
            location: "Seminyak, Bali",
            startDateTime: "2026-03-01T15:00",
            endDateTime: "2026-03-08T10:00",
            provider: "Seminyak Villa Demo",
            bookingReference: "DEMO-BALI-HOTEL1",
            cost: 980,
            currencyCode: "AUD",
            notes: "Cancelled accommodation item."
        },
        {
            tripId: baliTrip._id,
            type: "tour",
            status: "cancelled",
            title: "Cancelled temple and waterfall tour",
            location: "Ubud, Bali",
            startDateTime: "2026-03-03T09:00",
            endDateTime: "2026-03-03T16:00",
            provider: "Bali Day Tours Demo",
            bookingReference: "DEMO-BALI-TOUR1",
            cost: 190,
            currencyCode: "AUD",
            notes: "Cancelled tour item."
        },
        {
            tripId: adminTrip._id,
            type: "flight",
            status: "completed",
            title: "Admin flight to Melbourne",
            location: "Brisbane Airport",
            startDateTime: "2025-09-15T09:00",
            endDateTime: "2025-09-15T11:25",
            provider: "Demo Business Air",
            bookingReference: "DEMO-ADM-FLT1",
            cost: 320,
            currencyCode: "AUD",
            notes: "Completed admin-owned flight."
        },
        {
            tripId: adminTrip._id,
            type: "accommodation",
            status: "completed",
            title: "Admin conference hotel",
            location: "Melbourne CBD",
            startDateTime: "2025-09-15T14:00",
            endDateTime: "2025-09-18T10:00",
            provider: "Melbourne Central Hotel",
            bookingReference: "DEMO-ADM-HOTEL1",
            cost: 780,
            currencyCode: "AUD",
            notes: "Completed admin-owned accommodation."
        },
        {
            tripId: adminTrip._id,
            type: "activity",
            status: "completed",
            title: "Conference welcome event",
            location: "Melbourne Convention Centre",
            startDateTime: "2025-09-15T18:00",
            endDateTime: "2025-09-15T20:00",
            provider: "Demo Tech Conference",
            bookingReference: "DEMO-ADM-CONF1",
            cost: 0,
            currencyCode: "AUD",
            notes: "Completed admin-owned activity."
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
