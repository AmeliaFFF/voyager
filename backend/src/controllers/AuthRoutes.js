const express = require("express");
const { User } = require("../models/User");
const { generateJwt } = require("../utils/jwtFunctions");
const authMiddleware = require("../middleware/authMiddleware");

const authRouter = express.Router();

// POST /auth/register
// Creates a new user account.
authRouter.post("/register", async (request, response) => {
    try {
        const { name, email, password } = request.body || {};

        // Validate required fields.
        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Name, email, and password are required."
            });
        }

        // Clean and normalise values before saving to the database.
        const trimmedName = name.trim();
        const normalisedEmail = email.trim().toLowerCase();

        // Validate email format.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalisedEmail)) {
            return response.status(400).json({
                message: "Please provide a valid email address."
            });
        }

        // Validate password length.
        if (password.length < 8) {
            return response.status(400).json({
                message: "Password must be at least 8 characters long."
            });
        }

        // Validate password complexity (at least one uppercase letter, one lowercase letter, and one number).
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

        if (!passwordRegex.test(password)) {
            return response.status(400).json({
                message: "Password must contain at least one uppercase letter, one lowercase letter, and one number."
            });
        }

        // Prevent duplicate email registration.
        const existingUser = await User.findOne({ email: normalisedEmail });

        if (existingUser) {
            return response.status(409).json({
                message: "An account with this email already exists."
            });
        }

        // Create the new user.
        // The plain password is passed into passwordHash temporarily. The pre-save hook in the User model will automatically hash the password before saving it to the database.
        const newUser = await User.create({
            name: trimmedName,
            email: normalisedEmail,
            passwordHash: password
        });

        // Return a success response without exposing password data.
        response.status(201).json({
            message: "User registered successfully.",
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            }
        });

    } catch (error) {
        console.error(error);

        response.status(500).json({
            message: "An error occurred while registering the user."
        });
    }
});

// POST /auth/login
// Authenticates a user and returns a JWT.
authRouter.post("/login", async (request, response) => {
    try {
        const { email, password } = request.body || {};

        // Validate required fields.
        if (!email || !password) {
            return response.status(400).json({
                message: "Email and password are required."
            });
        }

        // Normalise email before lookup.
        const normalisedEmail = email.trim().toLowerCase();

        // Find the user by email.
        const foundUser = await User.findOne({ email: normalisedEmail });

        if (!foundUser) {
            return response.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Compare the incoming password with the stored password hash.
        const doPasswordsMatch = foundUser.comparePassword(password);

        if (!doPasswordsMatch) {
            return response.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Generate a JWT for the logged-in user.
        const resultJwt = generateJwt(foundUser);

        return response.status(200).json({
            message: "Login successful.",
            data: {
                token: resultJwt
            }
        });
    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while logging in."
        });
    }
});

// GET /auth/me
// Returns the currently authenticated user.
authRouter.get("/me", authMiddleware, async (request, response) => {
    try {
        const userId = request.user.userId;

        const foundUser = await User.findById(userId);

        if (!foundUser) {
            return response.status(404).json({
                message: "User not found."
            });
        }

        return response.status(200).json({
            message: "Authenticated user retrieved successfully.",
            data: {
                id: foundUser._id,
                name: foundUser.name,
                email: foundUser.email,
                createdAt: foundUser.createdAt,
                updatedAt: foundUser.updatedAt
            }
        });

    } catch (error) {
        console.error(error);

        return response.status(500).json({
            message: "An error occurred while retrieving the user."
        });
    }
});

module.exports = authRouter;