const express = require("express");
const cors = require("cors");
const logger = require("./logger");  // Import logger
const mainRouter = require("./routes/index");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`, { body: req.body });
  next();
});

app.use("/api/v1", mainRouter);

app.get("/", (req, res) => {
  logger.info("Home route accessed");
  res.send("Hello");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
