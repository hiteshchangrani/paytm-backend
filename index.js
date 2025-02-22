const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/index");
const logger = require("./logger"); // Import the logger

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", mainRouter);

app.get("/", (req, res) => {
    logger.info("Received request on /"); // Log request
    res.send("Hello");
});

// Test log when the server starts
app.listen(3000, () => {
    logger.info("Server started on port 3000"); // Log server start
});
