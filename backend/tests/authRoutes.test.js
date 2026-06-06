const request = require("supertest");
const app = require("../src/app");
const { User } = require("../src/models/User");
const { dbConnect, dbDisconnect } = require("../src/utils/database");

beforeAll(async () => {
    await dbConnect();
});

beforeEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await dbDisconnect();
});

describe("POST /auth/register", () => {
    it("should register a new user", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "test.user@example.com",
                password: "Password123"
            })
            .expect(201);

        expect(response.body.message).toBe("User registered successfully.");
        expect(response.body.data.email).toBe("test.user@example.com");
        expect(response.body.data.name).toBe("Test User");
        expect(response.body.data.isAdmin).toBe(false);
        expect(response.body.data.passwordHash).toBeUndefined();
    });

    it("should reject duplicate email registration", async () => {
        await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "test.user@example.com",
                password: "Password123"
            })
            .expect(201);

        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Another User",
                email: "test.user@example.com",
                password: "Password123"
            })
            .expect(409);

        expect(response.body.message).toBe("An account with this email already exists.");
    });

    it("should reject a weak password", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "test.user@example.com",
                password: "password"
            })
            .expect(400);

        expect(response.body.message).toBe("Password must contain at least one uppercase letter, one lowercase letter, and one number.");
    });

    it("should not allow users to self-register as admin", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Sneaky Admin",
                email: "sneaky.admin@example.com",
                password: "Password123",
                isAdmin: true
            })
            .expect(201);

        expect(response.body.data.isAdmin).toBe(false);

        const createdUser = await User.findOne({
            email: "sneaky.admin@example.com"
        });

        expect(createdUser.isAdmin).toBe(false);
    });
});

describe("POST /auth/login", () => {
    it("should login with valid credentials", async () => {
        await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "test.user@example.com",
                password: "Password123"
            })
            .expect(201);

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "test.user@example.com",
                password: "Password123"
            })
            .expect(200);

        expect(response.body.message).toBe("Login successful.");
        expect(response.body.data.token).toBeDefined();
    });

    it("should reject invalid login credentials", async () => {
        await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "test.user@example.com",
                password: "Password123"
            })
            .expect(201);

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "test.user@example.com",
                password: "WrongPassword123"
            })
            .expect(401);

        expect(response.body.message).toBe("Invalid email or password.");
    });
});

describe("GET /auth/me", () => {
    it("should return the authenticated user", async () => {
        await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "test.user@example.com",
                password: "Password123"
            })
            .expect(201);

        const loginResponse = await request(app)
            .post("/auth/login")
            .send({
                email: "test.user@example.com",
                password: "Password123"
            })
            .expect(200);

        const token = loginResponse.body.data.token;

        const response = await request(app)
            .get("/auth/me")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        expect(response.body.message).toBe("Authenticated user retrieved successfully.");
        expect(response.body.data.email).toBe("test.user@example.com");
        expect(response.body.data.isAdmin).toBe(false);
    });

    it("should reject requests without an Authorization header", async () => {
        const response = await request(app)
            .get("/auth/me")
            .expect(401);

        expect(response.body.message).toBe("Authorization header is missing.");
    });
});