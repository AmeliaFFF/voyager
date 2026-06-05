const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const authRouter = require("./controllers/AuthRoutes");
const tripRouter = require("./controllers/TripRoutes");
const tripItemRouter = require("./controllers/TripItemRoutes");
const exportRouter = require("./controllers/ExportRoutes");
const adminRouter = require("./controllers/AdminRoutes");
const requestLogger = require("./middleware/requestLogger");

const app = express();

app.use(helmet());

app.use(cors({
    origin: [
        "http://localhost:5173", // For Vite/React.
        "http://localhost:3000" // For local development.
    ],
    optionsSuccessStatus: 200
}));

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
app.use("/trips", exportRouter);
app.use("/admin", adminRouter);

module.exports = app;