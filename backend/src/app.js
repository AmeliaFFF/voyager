const express = require("express");
const authRouter = require("./controllers/AuthRoutes");
const tripRouter = require("./controllers/TripRoutes");
const tripItemRouter = require("./controllers/TripItemRoutes");
const requestLogger = require("./middleware/requestLogger");

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get("/", (request, response) => {
    response.json({
        message: "Welcome to the Voyager API"
    });
});

app.use("/auth", authRouter);
app.use("/trips", tripRouter);
app.use("/", tripItemRouter);

module.exports = app;