const request = require("supertest");
const app = require("../src/app");
const { User } = require("../src/models/User");
const { Trip } = require("../src/models/Trip");
const { TripItem } = require("../src/models/TripItem");
const { dbConnect, dbDisconnect } = require("../src/utils/database");

let authToken;

async function createAndLoginTestUser() {
    await request(app)
        .post("/auth/register")
        .send({
            name: "Trip Test User",
            email: "trip.test@example.com",
            password: "Password123"
        })
        .expect(201);

    const loginResponse = await request(app)
        .post("/auth/login")
        .send({
            email: "trip.test@example.com",
            password: "Password123"
        })
        .expect(200);

    return loginResponse.body.data.token;
}

beforeAll(async () => {
    await dbConnect();
});

beforeEach(async () => {
    await User.deleteMany({});
    await Trip.deleteMany({});
    await TripItem.deleteMany({});

    authToken = await createAndLoginTestUser();
});

afterAll(async () => {
    await dbDisconnect();
});

describe("POST /trips", () => {
    it("should create a new trip for the authenticated user", async () => {
        const response = await request(app)
            .post("/trips")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: "Japan 2026",
                status: "planned",
                destination: "Japan",
                startDate: "2026-09-01",
                endDate: "2026-09-21",
                notes: "Test trip.",
                budget: 5000,
                currencyCode: "AUD"
            })
            .expect(201);

        expect(response.body.message).toBe("Trip created successfully.");
        expect(response.body.data.title).toBe("Japan 2026");
        expect(response.body.data.status).toBe("planned");
        expect(response.body.data.destination).toBe("Japan");
    });

    it("should reject trip creation without authentication", async () => {
        const response = await request(app)
            .post("/trips")
            .send({
                title: "Japan 2026",
                destination: "Japan",
                startDate: "2026-09-01",
                endDate: "2026-09-21"
            })
            .expect(401);

        expect(response.body.message).toBe("Authorization header is missing.");
    });

    it("should reject an invalid trip status", async () => {
        const response = await request(app)
            .post("/trips")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: "Invalid Status Trip",
                status: "confirmed",
                destination: "Japan",
                startDate: "2026-09-01",
                endDate: "2026-09-21"
            })
            .expect(400);

        expect(response.body.message).toBe("Invalid trip status. Status must be one of: planned, booked, completed, cancelled.");
    });
});

describe("GET /trips", () => {
    it("should return trips for the authenticated user", async () => {
        await request(app)
            .post("/trips")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: "Japan 2026",
                destination: "Japan",
                startDate: "2026-09-01",
                endDate: "2026-09-21"
            })
            .expect(201);

        const response = await request(app)
            .get("/trips")
            .set("Authorization", `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.message).toBe("Trips retrieved successfully.");
        expect(response.body.data.trips.length).toBe(1);
        expect(response.body.data.trips[0].title).toBe("Japan 2026");
    });
});

describe("GET /trips/:tripId", () => {
    it("should return one trip for the authenticated user", async () => {
        const createResponse = await request(app)
            .post("/trips")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: "Japan 2026",
                destination: "Japan",
                startDate: "2026-09-01",
                endDate: "2026-09-21"
            })
            .expect(201);

        const tripId = createResponse.body.data.id;

        const response = await request(app)
            .get(`/trips/${tripId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.message).toBe("Trip retrieved successfully.");
        expect(response.body.data.id).toBe(tripId);
        expect(response.body.data.title).toBe("Japan 2026");
    });

    it("should return 404 for an invalid trip ID", async () => {
        const response = await request(app)
            .get("/trips/not-a-real-id")
            .set("Authorization", `Bearer ${authToken}`)
            .expect(404);

        expect(response.body.message).toBe("Trip not found.");
    });
});

describe("PATCH /trips/:tripId", () => {
    it("should update one trip for the authenticated user", async () => {
        const createResponse = await request(app)
            .post("/trips")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: "Japan 2026",
                destination: "Japan",
                startDate: "2026-09-01",
                endDate: "2026-09-21"
            })
            .expect(201);

        const tripId = createResponse.body.data.id;

        const response = await request(app)
            .patch(`/trips/${tripId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                status: "booked",
                notes: "Flights booked."
            })
            .expect(200);

        expect(response.body.message).toBe("Trip updated successfully.");
        expect(response.body.data.status).toBe("booked");
        expect(response.body.data.notes).toBe("Flights booked.");
    });
});

describe("DELETE /trips/:tripId", () => {
    it("should delete one trip for the authenticated user", async () => {
        const createResponse = await request(app)
            .post("/trips")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                title: "Japan 2026",
                destination: "Japan",
                startDate: "2026-09-01",
                endDate: "2026-09-21"
            })
            .expect(201);

        const tripId = createResponse.body.data.id;

        const response = await request(app)
            .delete(`/trips/${tripId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.message).toBe("Trip deleted successfully.");

        const deletedTrip = await Trip.findById(tripId);
        expect(deletedTrip).toBeNull();
    });
});