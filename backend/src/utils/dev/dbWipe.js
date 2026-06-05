const { loadEnvFile } = require("node:process");
const mongoose = require("mongoose");
const { dbConnect, dbDisconnect } = require("../database");

loadEnvFile();

// Drops the current development database.
async function dbWipe() {
    console.log("Dropping database...");

    await mongoose.connection.dropDatabase();

    console.log("Database dropped successfully.");
}

dbConnect().then(async () => {
        await dbWipe();
        await dbDisconnect();
    })
    .catch(async (error) => {
        console.error("Database wipe failed.");
        console.error(error);

        await dbDisconnect();
    });