const { loadEnvFile } = require("node:process");
const app = require("./app");
const { dbConnect } = require("./utils/database");

loadEnvFile();

const PORT = process.env.PORT || 3000;

// Connect to the database before starting the server.
dbConnect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("Server startup cancelled due to database connection failure.");
    });