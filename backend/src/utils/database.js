const mongoose = require("mongoose");

// Connect to the MongoDB database using the connection string stored in the environment variable.
async function dbConnect() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Connected to the database successfully!");
    } catch (error) {
        console.log("Failed to connect to the database.");
        console.error(error);
        throw error;
    }
}

// Close the database connection when needed.
async function dbDisconnect() {
    await mongoose.connection.close();
    console.log("Disconnected from the database.");
}

module.exports = {
    dbConnect,
    dbDisconnect
};