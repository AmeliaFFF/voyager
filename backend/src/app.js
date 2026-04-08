const express = require('express');
const authRouter = require("./controllers/AuthRoutes");
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

module.exports = app;