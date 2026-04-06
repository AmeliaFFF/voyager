const express = require('express');
const authRouter = require("./controllers/AuthRoutes");

const app = express();

app.use(express.json());

app.get("/", (request, response) => {
    response.json({
        message: "Welcome to the Voyager API"
    });
});

app.use("/auth", authRouter);

module.exports = app;