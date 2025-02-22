const express = require("express");
const logger = require("../logger"); // Import the logger
const userRouter = require("./user");
const accountRouter = require("./account");

const router = express.Router();

// Log incoming requests
router.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`, { body: req.body });
  next();
});

router.use("/user", userRouter);
router.use("/account", accountRouter);

module.exports = router;
