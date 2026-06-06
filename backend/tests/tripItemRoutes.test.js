const request = require("supertest");
const app = require("../src/app");
const { User } = require("../src/models/User");
const { Trip } = require("../src/models/Trip");
const { TripItem } = require("../src/models/TripItem");
const { dbConnect, dbDisconnect } = require("../src/utils/database");

let authToken;
let tripId;

async function createAndLoginTestUser() {
    await request(app)
        .post("/auth/register")
        .send({
            name: "Trip Item Test User",
            email: "trip.item.test@example.com",
            password: "Password123"
        })
        .expect(201);

    const loginResponse = await request(app)
        .post("/auth/login")
        .send({
            email: "trip.item.test@example.com",
            password: "Password123"
        })
        .expect(200);

    return loginResponse.body.data.token;
}

async function createTestTrip(token) {
    const response = await request(app)
        .post("/trips")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Japan 2026",
            destination: "Japan",
            startDate: "2026-09-01",
            endDate: "2026-09-21"
        })
        .expect(201);

    return response.body.data.id;
}

beforeAll(async () => {
    await dbConnect();
});

beforeEach(async () => {
    await User.deleteMany({});
    await Trip.deleteMany({});
    await TripItem.deleteMany({});

    authToken = await createAndLoginTestUser();
    tripId = await createTestTrip(authToken);
});

afterAll(async () => {
    await dbDisconnect();
});

describe("POST /trips/:tripId/items", () => {
    it("should create a new trip item for the authenticated user's trip", async () => {
        const response = await request(app)
            .post(`/trips/${tripId}/items`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                type: "flight",
                status: "booked",
                title: "Flight to Tokyo",
                location: "Brisbane Airport",
                startDateTime: "2026-09-01T10:00",
                endDateTime: "2026-09-01T19:30",
                provider: "Test Airline",
                bookingReference: "JPN123",
                cost: 1500,
                currencyCode: "AUD",
                notes: "Test flight item."
            })
            .expect(201);

        expect(response.body.message).toBe("Trip item created successfully.");
        expect(response.body.data.type).toBe("flight");
        expect(response.body.data.status).toBe("booked");
        expect(response.body.data.title).toBe("Flight to Tokyo");
        expect(response.body.data.tripId).toBe(tripId);
    });

    it("should create a trip item with default planned status when status is omitted", async () => {
        const response = await request(app)
            .post(`/trips/${tripId}/items`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                type: "accommodation",
                title: "Tokyo Hotel",
                startDateTime: "2026-09-01T15:00"
            })
            .expect(201);

        expect(response.body.data.status).toBe("planned");
    });

    it("should reject trip item creation without authentication", async () => {
        const response = await request(app)
            .post(`/trips/${tripId}/items`)
            .send({
                type: "flight",
                title: "Flight to Tokyo",
                startDateTime: "2026-09-01T10:00"
            })
            .expect(401);

        expect(response.body.message).toBe("Authorization header is missing.");
    });

    it("should reject an invalid trip item type", async () => {
        const response = await request(app)
            .post(`/trips/${tripId}/items`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                type: "hotel",
                title: "Tokyo Hotel",
                startDateTime: "2026-09-01T15:00"
            })
            .expect(400);

        expect(response.body.message).toBe("Invalid trip item type. Type must be one of: flight, transport, accommodation, tour, cruise, activity, other.");
    });

    it("should reject an invalid trip item status", async () => {
        const response = await request(app)
            .post(`/trips/${tripId}/items`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                type: "accommodation",
                status: "confirmed",
                title: "Tokyo Hotel",
                startDateTime: "2026-09-01T15:00"
            })
            .expect(400);

        expect(response.body.message).toBe("Invalid trip item status. Status must be one of: planned, booked, completed, cancelled.");
    });
});

describe("GET /trips/:tripId/items", () => {
    it("should return trip items for the authenticated user's trip", async () => {
        await request(app)
            .post(`/trips/${tripId}/items`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                type: "flight",
                title: "Flight to Tokyo",
                startDateTime: "2026-09-01T10:00"
            })
            .expect(201);

        const response = await request(app)
            .get(`/trips/${tripId}/items`)
            .set("Authorization", `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.message).toBe("Trip items retrieved successfully.");
        expect(response.body.data.tripItems.length).toBe(1);
        expect(response.body.data.tripItems[0].title).toBe("Flight to Tokyo");
    });
});

describe("GET /trip-items/:tripItemId", () => {
    it("should return one trip item for the authenticated user", async () => {
        const createResponse = await request(app)
            .post(`/trips/${tripId}/items`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                type: "flight",
                title: "Flight to Tokyo",
                startDateTime: "2026-09-01T10:00"
            })
            .expect(201);

        const tripItemId = createResponse.body.data.id;

        const response = await request(app)
            .get(`/trip-items/${tripItemId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.message).toBe("Trip item retrieved successfully.");
        expect(response.body.data.id).toBe(tripItemId);
        expect(response.body.data.title).toBe("Flight to Tokyo");
    });

    it("should return 404 for an invalid trip item ID", async () => {
        const response = await request(app)
            .get("/trip-items/not-a-real-id")
            .set("Authorization", `Bearer ${authToken}`)
            .expect(404);

        expect(response.body.message).toBe("Trip item not found.");
    });
});

describe("PATCH /trip-items/:tripItemId", () => {
    it("should update one trip item for the authenticated user", async () => {
        const createResponse = await request(app)
            .post(`/trips/${tripId}/items`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                type: "flight",
                title: "Flight to Tokyo",
                startDateTime: "2026-09-01T10:00"
            })
            .expect(201);

        const tripItemId = createResponse.body.data.id;

        const response = await request(app)
            .patch(`/trip-items/${tripItemId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                status: "completed",
                notes: "Flight completed."
            })
            .expect(200);

        expect(response.body.message).toBe("Trip item updated successfully.");
        expect(response.body.data.status).toBe("completed");
        expect(response.body.data.notes).toBe("Flight completed.");
    });
});

describe("DELETE /trip-items/:tripItemId", () => {
    it("should delete one trip item for the authenticated user", async () => {
        const createResponse = await request(app)
            .post(`/trips/${tripId}/items`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                type: "flight",
                title: "Flight to Tokyo",
                startDateTime: "2026-09-01T10:00"
            })
            .expect(201);

        const tripItemId = createResponse.body.data.id;

        const response = await request(app)
            .delete(`/trip-items/${tripItemId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .expect(200);

        expect(response.body.message).toBe("Trip item deleted successfully.");

        const deletedTripItem = await TripItem.findById(tripItemId);
        expect(deletedTripItem).toBeNull();
    });
});