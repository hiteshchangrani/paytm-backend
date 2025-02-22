const express = require("express");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const logger = require("../logger");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  try {
    logger.info("Fetching balance", { userId: req.userId });

    const account = await Account.findOne({ userId: req.userId });
    res.json({ balance: account.balance });
  } catch (error) {
    logger.error("Error fetching balance", { error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { amount, to } = req.body;

  try {
    logger.info("Transfer request received", { from: req.userId, to, amount });

    const account = await Account.findOne({ userId: req.userId }).session(session);
    if (!account || account.balance < amount) {
      await session.abortTransaction();
      logger.warn("Insufficient balance", { userId: req.userId, amount });
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      logger.warn("Invalid recipient account", { to });
      return res.status(400).json({ message: "Invalid account" });
    }

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
    await session.commitTransaction();

    logger.info("Transfer successful", { from: req.userId, to, amount });
    res.json({ message: "Transfer successful" });
  } catch (error) {
    await session.abortTransaction();
    logger.error("Transfer error", { error: error.message });
    res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
});

module.exports = router;
