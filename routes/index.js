const express = require("express");
const logger = require("../logger");
const userRouter = require("./user");
const accountRouter = require("./account");

const router = express.Router();

router.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`Request: ${req.method} ${req.originalUrl}`, {
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });
  next();
});

router.use("/user", userRouter);
router.use("/account", accountRouter);

module.exports = router;
