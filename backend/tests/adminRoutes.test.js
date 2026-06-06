const request = require("supertest");
const app = require("../src/app");
const { User } = require("../src/models/User");
const { Trip } = require("../src/models/Trip");
const { TripItem } = require("../src/models/TripItem");
const { dbConnect, dbDisconnect } = require("../src/utils/database");

let regularToken;
let adminToken;

async function registerUser({ name, email }) {
    await request(app)
        .post("/auth/register")
        .send({
            name,
            email,
            password: "Password123"
        })
        .expect(201);
}

async function loginUser(email) {
    const loginResponse = await request(app)
        .post("/auth/login")
        .send({
            email,
            password: "Password123"
        })
        .expect(200);

    return loginResponse.body.data.token;
}

async function makeUserAdmin(email) {
    await User.findOneAndUpdate(
        { email },
        { isAdmin: true }
    );
}

async function createTrip(token, title) {
    const response = await request(app)
        .post("/trips")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title,
            destination: "Japan",
            startDate: "2026-09-01",
            endDate: "2026-09-21"
        })
        .expect(201);

    return response.body.data.id;
}

async function createTripItem(token, tripId, title) {
    const response = await request(app)
        .post(`/trips/${tripId}/items`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            type: "flight",
            title,
            startDateTime: "2026-09-01T10:00"
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

    await registerUser({
        name: "Regular User",
        email: "regular.admin-routes@example.com"
    });

    await registerUser({
        name: "Admin User",
        email: "admin.admin-routes@example.com"
    });

    await makeUserAdmin("admin.admin-routes@example.com");

    regularToken = await loginUser("regular.admin-routes@example.com");
    adminToken = await loginUser("admin.admin-routes@example.com");
});

afterAll(async () => {
    await dbDisconnect();
});

describe("GET /admin/trips", () => {
    it("should reject regular users from admin trip routes", async () => {
        const response = await request(app)
            .get("/admin/trips")
            .set("Authorization", `Bearer ${regularToken}`)
            .expect(403);

        expect(response.body.message).toBe("Admin access required.");
    });

    it("should return all trips for an admin user", async () => {
        await createTrip(regularToken, "Regular User Trip");
        await createTrip(adminToken, "Admin User Trip");

        const response = await request(app)
            .get("/admin/trips")
            .set("Authorization", `Bearer ${adminToken}`)
            .expect(200);

        expect(response.body.message).toBe("All trips retrieved successfully.");
        expect(response.body.data.trips.length).toBe(2);
    });
});

describe("GET /admin/trip-items", () => {
    it("should return all trip items for an admin user", async () => {
        const regularTripId = await createTrip(regularToken, "Regular User Trip");
        const adminTripId = await createTrip(adminToken, "Admin User Trip");

        await createTripItem(regularToken, regularTripId, "Regular User Flight");
        await createTripItem(adminToken, adminTripId, "Admin User Flight");

        const response = await request(app)
            .get("/admin/trip-items")
            .set("Authorization", `Bearer ${adminToken}`)
            .expect(200);

        expect(response.body.message).toBe("All trip items retrieved successfully.");
        expect(response.body.data.tripItems.length).toBe(2);
    });
});

describe("DELETE /admin/trips/:tripId", () => {
    it("should allow an admin user to delete any trip", async () => {
        const tripId = await createTrip(regularToken, "Regular User Trip");

        const response = await request(app)
            .delete(`/admin/trips/${tripId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .expect(200);

        expect(response.body.message).toBe("Trip deleted successfully by admin.");

        const deletedTrip = await Trip.findById(tripId);
        expect(deletedTrip).toBeNull();
    });

    it("should delete related trip items when an admin deletes a trip", async () => {
        const tripId = await createTrip(regularToken, "Regular User Trip");
        const tripItemId = await createTripItem(regularToken, tripId, "Regular User Flight");

        await request(app)
            .delete(`/admin/trips/${tripId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .expect(200);

        const deletedTrip = await Trip.findById(tripId);
        const deletedTripItem = await TripItem.findById(tripItemId);

        expect(deletedTrip).toBeNull();
        expect(deletedTripItem).toBeNull();
    });
});