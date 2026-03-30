// This script sets up the .env file with default values if it doesn't already exist.
// This is based on code provided by Alex and adapted for the Voyager project.
const fs = require("node:fs/promises");
const cryptography = require("node:crypto");
const { loadEnvFile } = require("node:process");

async function setupEnv() {
	// Load existing .env file if it exists, otherwise create a new one with default values.
	try {
		loadEnvFile();
		console.log(".env file already exists! Skipping creation.");
		return;
	} catch (error) {
		console.log("No .env file found, creating a new one...");
	}

	// Default environment values.
	let defaultValues = {
		// Default server port.
		PORT: 3000,

		// Secure random JWT secret key.
		JWT_SECRET_KEY: cryptography.randomBytes(64).toString("hex"),

		// Default MongoDB connection string.
		DATABASE_URL: "mongodb://127.0.0.1:27017/voyager"
	};

	let stringToWrite = "";

	// Build .env file content.
	for (const key in defaultValues) {
		stringToWrite += `${key}=${defaultValues[key]}\n`;
	}

	if (stringToWrite.length > 0) {
		stringToWrite = stringToWrite.trim();

		await fs.writeFile(".env", stringToWrite);

		console.log("Written the following data to '.env':\n" + stringToWrite);
	} else {
		console.log("No data to write, skipping operations.");
	}
}

setupEnv();